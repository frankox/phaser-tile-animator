### 🪄 phaser-tile-animator

> 🧱 A lightweight, dependency-free **Phaser 3 plugin** that animates Tiled tilesets directly inside your game — no need for custom frame logic or sprite hacks.

---

### 🚀 Features

* 🎨 Supports **Tiled animated tiles** out of the box (`tileData.animation` in exported JSON)
* ⚡ **Optimized** — updates only the tiles that actually animate (no per-frame scans)
* 🕹️ Easy API — just call `this.tileAnimator.init(map)`
* ⏯️ `pause()` / `resume()` / `destroy()` built-in
* 🧩 Works as a **Scene Plugin** — automatically integrates with Phaser’s lifecycle
* 🧠 Written in TypeScript — ships with full type definitions

---

### 📦 Installation

```bash
npm install phaser-tile-animator
```

You must already have Phaser 3 installed:

```bash
npm install phaser
```

---

### 🧰 Setup

Add the plugin to your Phaser game configuration:

```ts
import { TileAnimatorPlugin } from 'phaser-tile-animator'

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  scene: [GameScene],
  plugins: {
    scene: [
      {
        key: 'TileAnimatorPlugin',
        plugin: TileAnimatorPlugin,
        mapping: 'tileAnimator' // accessible via this.tileAnimator
      }
    ]
  }
}

export default new Phaser.Game(config)
```

---

### 🎮 Usage

In your scene:

```ts
export class GameScene extends Phaser.Scene {
  create() {
    const map = this.make.tilemap({ key: 'map' })
    const tileset = map.addTilesetImage('beach', 'beach')
    map.createLayer('Ground', tileset, 0, 0)

    // 🎞️ Start tile animations
    this.tileAnimator.init(map)
    
    // 🎚️ Set animation speed (default baseline is 10 FPS)
    this.tileAnimator.setFrameRate(30) // ~3x faster than Tiled durations
    this.tileAnimator.setSpeedMultiplier(0.5) // Or halve the speed directly
  }

  update() {
    // You can pause/resume animations anytime:
    this.tileAnimator.pause()
    this.tileAnimator.resume()
    
    // Or adjust speed dynamically:
     this.tileAnimator.setFrameRate(60) // Speed up using FPS-style input
     this.tileAnimator.setSpeedMultiplier(0.25)  // Or slow everything down
  }
}
```

---

### ⚙️ API

| Method                               | Description                                             |
| ------------------------------------ | ------------------------------------------------------- |
| `init(map: Phaser.Tilemaps.Tilemap)` | Reads Tiled animation data and starts animating tiles.  |
| `pause()`                            | Temporarily freezes all tile animations.                |
| `resume()`                           | Resumes paused animations.                              |
| `setFrameRate(fps: number)`          | Sets a global animation speed relative to the 10 FPS baseline, preserving per-frame durations from Tiled. |
| `setSpeedMultiplier(multiplier: number)` | Directly apply a global multiplier (e.g., 0.5 for half speed, 2 for double speed). |
| `getFrameRate()`                     | Gets the current framerate in FPS.                     |
| `getSpeedMultiplier()`               | Gets the current global speed multiplier.             |
| `destroy()`                          | Stops listening to scene updates and clears references. |

---

### ⚡ How It Works

`TileAnimator` reads `tileData` from each tileset (as exported by **Tiled**) and caches references to all tiles that need animation.
Each frame, it updates only those tiles based on the durations defined in your `.json` map, then scales them by your chosen global speed.

**Performance:** even large maps with hundreds of tiles animate smoothly, since each tile’s position is pre-cached at startup.

---

### 🧪 Example Tiled JSON snippet

```json
"tileData" : {
  "8": {
    "animation": [
      { "duration": 350, "tileid": 8 },
      { "duration": 350, "tileid": 12 },
      { "duration": 350, "tileid": 16 }
    ]
  }
}
```

---

### 🧠 Tips

* Works best with **embedded tilesets** in your map JSON (via *Map → Embed Tilesets* in Tiled).
* Supports **multiple tilesets** automatically.
* Use `pause()` when showing menus or paused screens.
* Combine with global shaders or lighting for cool water/fire effects.

---

### 🧩 TypeScript Support

Full typings are included out of the box.

```ts
import { TileAnimator, TileAnimatorPlugin } from 'phaser-tile-animator'
```

---

### 📜 License

MIT © 2025 Matteo Franchini
Made with ❤️ for the Phaser community.

---

### 🌟 Support

If you like the plugin, consider starring it on GitHub — it helps others discover it too!
