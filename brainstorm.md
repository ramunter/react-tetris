## After clearing a few rows, all tetrimonos get cleared on collisions

Seems likely that we're holding onto an old state of the stage for calculating the row clearing/collision checks vs the stage used for drawing. The former is the static stage, the latter is the stage + player position.

Note we actually have two separate stage states at the moment, one for calculation and one for drawing.

Lets look at what we're passing into clear rows. It looks like this is the correct calculation state.

Lets pull out the debugger and check what the row looks like in our row sweeper when hitting this error.

Our row looks like 

`[0, 0, 0, 0, 0, 0]` 

and our check is 

`const noEmptyTilesInRow = (row: ITile[]) => row.findIndex((tile: ITile) => tile.status === TileStatus.Empty) === -1;`

We shouldn't fill with 0's we should fill with `TileStatus.Empty`

`newStage.unshift(new Array(stage[0].length).fill(0));`

becomes

`newStage.unshift(new Array(stage[0].length).fill(TileStatus.Empty));`

This doesn't actually matter, the enum is equal to 0 here regardless. 

Ah but we shouldn't fill wil `TileStatus` we need to fill with actual tiles. 

The error is `tile.status` is undefined for our cleared rows when we fill in the current way.

`                newStage.unshift(new Array(stage[0].length).fill(EMPTY_TILE));` 

should fix it.


## Rotating the tetremino resets post to an old state

Lets start at the rotate function

```
  const rotatePlayer = (direction: number, stage: ITile[][]) => {
    player = player.rotate(direction);
    if(!isValidMove(player, { x: 0, y: 0 }, stage)) {
        player = player.rotate(-direction);
    }
    setPlayer(player);
```

where rotate looks like

```
    rotate = (direction:number) => {
        const matrix = this.tetromino
        if (direction > 0) {
            this.tetromino = matrix[0].map((_val, index) => matrix.map(row => row[index]).reverse());
        } else if (direction < 0) {
            this.tetromino = matrix[0].map((_val, index) => matrix.map(row => row[row.length-1-index])); 
        }
        return this;
    }
```

and our player consists of 

```
    collided: boolean;
    tetromino: ITile[][];
    position: ICoordinate;
```

This means we should only be changing the tetromino grid, not the tetromino placement on rotation. 

I think theres something tricky referencing a state variable (player) in this way. Its possible that the passed in player state is out of sync with the rendered one.

When we rotate, we set the player to whatever we've stored in this fucntion, so if this is older, the effect will be moving the player back to an old position.

At the moment thie player is passed into `usePlayer`

```
export const usePlayer = (player:Player, setPlayer: any, setStage:any, setIsGameOver:any) => {

  const rotatePlayer = (direction: number, stage: ITile[][]) => {
``` 

Why are we doing this?

To avoid returning player from usePlayer. Lets move player in and return it out instead. We can clean up the function signature later.

WAIT no thats not why. Its due to dependency between states.

Looks like this was a dependency we added fixing an earlier bug where we were running the following too often

```
    useEffect(() => {
        setStage(sweepRows(stage));
    }, [player])
```

If I can remove this `player`, I can then refactor `player` initialization into `usePlayer`. 

Ideally I rewrite this to

```
    useEffect(() => {
        setStage(sweepRows(stage));
    }, [stage])
```

but this creates a loop since we're updating stage everytime stage updates.

Maybe we can make this depend on the drop interval instead? This is a more direct connection.

To do this lets not useEffect, but explicitly call the function. 

Doing this means we actually have to make the useStage uglier

`const [stage, setStage] = useStage();`

becomes

`const [stage, setStage, sweepRows] = useStage();`

but now we can call `sweepRows` in our useInteval call

```
useInterval(() => {
    if (isGameOver) {
        return
    }
    playerInput(KEYS.DOWN, stage);
    sweepRows(stage);
}, dropTime());
```

and can refactor `player` into `usePlayer`.

`const [playerInput, resetPlayer] = usePlayer(player, setPlayer, setStage, setIsGameOver);`

becomes 

`const [player, playerInput, resetPlayer] = usePlayer(setStage, setIsGameOver);`

Unfortunately looks like this did not change the behaviour in question.

Comparing this setPlayer to other set players, we could be more careful setting the player here.

Updating to 

```
    setPlayer((prev: Player) => ({
      ...prev,
      tetromino: updatedPlayer.tetromino,
    }))
```

will make sure we rely on the in state position. Updating this fixed the issue!

## Tetreminos keep spawning after game over 

Likely not stopping player/interval when game over. Lets try setting interval to 0 when game over? 

`const dropTime = useCallback(() => (BASE_INTERVAL / (gameStatus.level + 1)), [gameStatus.level]);`

becomes

` const dropTime = useCallback(() => isGameOver ? 0 : (BASE_INTERVAL / (gameStatus.level + 1)), [gameStatus.level, isGameOver]);`

This makes it infinetly fast. Can set a very high number but this isn't the intention

Can not drop the player on game over 

`    useInterval(() => playerInput(KEYS.DOWN, stage), dropTime());`

becomes 

`    useInterval(() => isGameOver ? playerInput(KEYS.DOWN, stage) : filler(), dropTime());`

This doesnt prevent collison checks? OOps wrong way around

`    useInterval(() => !isGameOver ? playerInput(KEYS.DOWN, stage) : 0, dropTime());` 

This stops the game from updating after game over - **but** we're still spawning one overlaying tetremino before noticing the game is over, this looks bad.

How are we checking the game is over? In usePlayer - this feels somewhat wrong. 


```{javascript}

if(!isValidMove(resetPlayer, {x:0,y:0}, stage)){
    setIsGameOver(true);
}
setPlayer(resetPlayer)
  ```

  We're just not exiting before seting player. Lets fix that.

```{javascript}
if(!isValidMove(resetPlayer, {x:0,y:0}, stage)){
    setIsGameOver(true);
} else {
    setPlayer(resetPlayer);
}
```

Fixed!