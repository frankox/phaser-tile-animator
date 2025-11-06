import Phaser from 'phaser'
import { TileAnimator } from './TileAnimator'

export class TileAnimatorPlugin extends Phaser.Plugins.ScenePlugin {
    private animator!: TileAnimator

    constructor(scene: Phaser.Scene, pluginManager: Phaser.Plugins.PluginManager, pluginKey: string) {
        super(scene, pluginManager, pluginKey)
    }

    boot() {
        if(!this.scene) return

        this.animator = new TileAnimator(this.scene)
        this.systems?.events.once(Phaser.Scenes.Events.SHUTDOWN, this.shutdown, this)
    }

    init(map: Phaser.Tilemaps.Tilemap) {
        this.animator.init(map)
    }

    shutdown() {
        this.systems?.events.off(Phaser.Scenes.Events.UPDATE, this.animator.update, this.animator)
    }
}
