import Phaser from 'phaser'

interface TileAnimationFrame {
    tileid: number
    duration: number
}

interface TileAnimation {
    baseIndex: number
    frames: TileAnimationFrame[]
    timer: number
    currentFrame: number
    tiles: Phaser.Tilemaps.Tile[]
}

export class TileAnimator {
    private scene: Phaser.Scene
    private layers: Phaser.Tilemaps.TilemapLayer[] = []
    private animations: TileAnimation[] = []
    private paused = false
    private frameRate = 10

    constructor(scene: Phaser.Scene) {
        this.scene = scene
    }

    /**
     * Reads animation data from a Tiled map and initializes tile animations.
     */
    init(map: Phaser.Tilemaps.Tilemap, frameRate = 10): void {
        this.frameRate = frameRate
        this.layers = map.layers.map((l: { name: any }) => map.getLayer(l.name)!.tilemapLayer)

        for (const ts of map.tilesets) {
            for (const [idStr, tile] of Object.entries(ts.tileData)) {
                const id = Number(idStr)

                if (!tile.animation) continue

                this.animations.push({
                    baseIndex: ts.firstgid + id,
                    frames: tile.animation,
                    timer: 0,
                    currentFrame: 0,
                    tiles: []
                })
            }
        }

        this.cacheAnimatedTiles()

        this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this)
    }

    /**
     * Pauses all tile animations.
     */
    pause(): void {
        this.paused = true
    }

    /**
     * Resumes all tile animations.
     */
    resume(): void {
        this.paused = false
    }

    /**
     * Sets the absolute framerate for all animations.
     * @param fps - Frames per second (e.g., 10, 30, 60)
     */
    setFrameRate(fps: number): void {
        this.frameRate = Math.max(0.1, fps)
    }

    /**
     * Gets the current framerate.
     * @returns The current framerate in FPS
     */
    getFrameRate(): number {
        return this.frameRate
    }

    /**
     * Stops listening to scene events and clears all data.
     */
    destroy(): void {
        this.scene.events.off(Phaser.Scenes.Events.UPDATE, this.update, this)
        this.animations = []
        this.layers = []
    }

    update(_time: number, delta: number) {
        if (this.paused || this.animations.length === 0) return

        const frameTime = 1000 / this.frameRate
        const adjustedDelta = delta * (frameTime / 100)

        for (const anim of this.animations) {
            anim.timer += adjustedDelta
            const current = anim.frames[anim.currentFrame]

            if (anim.timer >= current.duration) {
                anim.timer = 0
                anim.currentFrame = (anim.currentFrame + 1) % anim.frames.length
                const next = anim.frames[anim.currentFrame]

                for (const layer of this.layers) {
                    layer.forEachTile(tile => {
                        if (tile.index === anim.baseIndex + current.tileid - anim.frames[0].tileid) {
                            tile.index = anim.baseIndex + next.tileid - anim.frames[0].tileid
                        }
                    })
                }
            }
        }
    }

    /**
     * Pre-computes all tile references that need animation updates.
     */
    private cacheAnimatedTiles(): void {
        for (const layer of this.layers) {
            layer.forEachTile(tile => {
                for (const anim of this.animations) {
                    const firstFrame = anim.frames[0]
                    const firstTileIndex = anim.baseIndex + firstFrame.tileid - firstFrame.tileid
                    if (tile.index === firstTileIndex + anim.frames[0].tileid - firstFrame.tileid) {
                        anim.tiles.push(tile)
                    }
                }
            })
        }

        this.animations = this.animations.filter(a => a.tiles.length > 0)
        console.log(`[TileAnimator] Cached ${this.animations.reduce((n, a) => n + a.tiles.length, 0)} tiles`)
    }
}
