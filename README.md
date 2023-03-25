# Cliptron

<div align="left">

A tiny app to manage your clipboard history, works for Windows, MacOS, and Linux.

<img width="380px" align="right" style="margin-left: 16px;" src="screenshot.png" />

<ul>
    <li>
        <strong>Remembers text & images that you copy 📋</strong> <br />
      An awesome feature with cliptron is that it remembers all kind of copies, no matter if it is a text or an image.
    </li>
    <li>
        <strong>Save what you copied to individual files ⬇️</strong> <br /> You can save what you copy locally inside a text/image files in the format that you choose!
    </li>
    <li>
        <strong>Dark/Light Theme support 🌕🌞</strong><br />  If you don't care about your eyes.
       </li>
    <li>
        <strong>Choose your shortcut key #️⃣</strong><br />  Assign a shortcut for calling your clipboard history.
    </li>
</ul>

## Requirements for running on Linux
For Linux users, you need `x11-utils` and `xdotool` packages installed on your system.
```bash
sudo apt-get install x11-utils
sudo apt-get install xdotool
```

## Installation
Check the [Release section](https://github.com/fayez-nazzal/Cliptron/releases) for getting pre-built packages for your operating system.

- For **Linux**, a debian `.deb`, and an Arch Linux `.zst` packages are available.

- For **MacOS**, there's a `.dmg` Image file availale in the release section.

- For **Windows**, an installer package `.msi` is available.

## Building From Source
### Build Requirements
- [Rust](https://www.rust-lang.org/)
- [Node.js](https://nodejs.org/en/)
- For Windows users, you would need [Microsoft Visual Studio C++ Build Tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/)
- For Linux users, make sure to install the following dependencies:
```bash
$ sudo apt update
$ sudo apt install libwebkit2gtk-4.0-dev build-essential curl wget libssl-dev libgtk-3-dev libayatana-appindicator3-dev librsvg2-dev
 ```

### Building

1. Clone this repo in a directory of your choice:
```console
  git clone https://github.com/fayez-nazzal/Cliptron/edit/master cliptron
```

2. Enter the cloned directory:
```console
  cd cliptron
```

3. Run the following commands to start the build process:
```console
npm run build
npm run tauri build
```

4. You will find resulting binaries in `cliptron/src-tauri/target/release`.

## Techs used
This project is written entirely using [Rust](https://www.rust-lang.org/) & [Next.js](https://vercel.com/solutions/nextjs) by using the power of the awesome [Tauri Toolkit](https://tauri.app/).

## TODO List
- Auto Paste feature.
- Global shortcut without a requirement to hide the window.

## Contribution
You are welcome to join 👋

## License
This product is licensed under MIT License.
</div>
