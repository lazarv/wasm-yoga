# wasm-yoga

This is **wasm-yoga**, a Yoga Layout prebuilt version using WebAssembly, built using Emscripten.

## Install

Run `npm install @lazarv/wasm-yoga`.

## Usage

TypeScript type definition included.

```js
import wasmYoga from '@lazarv/wasm-yoga';

async function useYoga(){
	const Yoga = await wasmYoga();
	const node = Yoga.Node.createDefault();
	node.setAlignItems(Yoga.YGAlignCenter);
	node.calculateLayout(100, 100, Yoga.YGDirectionLTR);
	// etc...
}
```

See `examples` directory for more examples, usage in browser (`index.html`) and node.js (`wasm.js`).

## Build

Before any build, fetch the `yoga` source included as a git submodule and run `npm install`. **wasm-yoga** uses `nbind` C source and minimal `nbind` Emscripten JavaScript library.

```sh
git submodule init
git submodule update
```

In order to build **wasm-yoga** yourself, you will need [Emscripten](https://emscripten.org) and [cmake](https://cmake.org/download).
For more information about setting up Emscripten, see the [getting started guide](https://emscripten.org/docs/getting_started).

To build on your local machine, just use `npm run build`.

Run these commands to build the project manually, step by step. Result `yoga.js` and `yoga.wasm` will be available in the `dist` directory.

```sh
mkdir build
cd build
emcmake cmake ..
emmake make
```

### Building using Docker

**wasm-yoga** can also be built with Docker. This offers many advantages (keeping its native environment clean, portability, etc.). To do this, you just have to install Docker and run:

```sh
docker-compose build  # to create the Docker image
docker-compose up     # to create the Docker container and build wasm-yoga
```

If you want to add arguments to cmake, you have to edit the `docker-compose.yml` file.