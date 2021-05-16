cmake_minimum_required( VERSION 3.0.0 )
project(wasm-yoga)

set(CMAKE_RUNTIME_OUTPUT_DIRECTORY ${CMAKE_CURRENT_LIST_DIR}/dist)

FIND_PACKAGE(Python3)
set(PYTHON ${Python3_EXECUTABLE} CACHE STRING "Python path")
set(EMSCRIPTEN_ROOT $ENV{EMSDK}/upstream/emscripten CACHE STRING "Emscripten path")
set(CMAKE_TOOLCHAIN_FILE ${EMSCRIPTEN_ROOT}/cmake/Modules/Platform/Emscripten.cmake)
set(WEBIDL_BINDER_SCRIPT ${EMSCRIPTEN_ROOT}/tools/webidl_binder.py)
set(YOGA_FRONT_MATTER_FILE ${CMAKE_CURRENT_SOURCE_DIR}/src/front-matter.js)
set(NBIND_EM_API_FILE ${CMAKE_CURRENT_SOURCE_DIR}/node_modules/nbind/dist/em-api.js)
set(NBIND_LIB_FILE ${CMAKE_CURRENT_SOURCE_DIR}/src/nbind.js)
set(YOGA_HEADER_FILE ${CMAKE_CURRENT_SOURCE_DIR}/src/yoga.h)
set(YOGA_IDL_FILE ${CMAKE_CURRENT_SOURCE_DIR}/src/yoga.idl)
set(YOGA_ONLOAD_FILE ${CMAKE_CURRENT_SOURCE_DIR}/src/onload.js)
set(DIST ${CMAKE_CURRENT_SOURCE_DIR}/dist)

include_directories(
	yoga
	yoga/yoga
	# ${CMAKE_CURRENT_SOURCE_DIR}
	${CMAKE_CURRENT_SOURCE_DIR}/node_modules
	${CMAKE_CURRENT_SOURCE_DIR}/node_modules/nbind/include
)
file (GLOB ROOT_FILES yoga/yoga/*.cpp)
file (GLOB EVENT_FILES yoga/yoga/event/*.cpp)
file (GLOB INTERNAL_FILES yoga/yoga/internal/*.cpp)
set (
	SRC_FILES
	${ROOT_FILES}
	${EVENT_FILES}
	${INTERNAL_FILES}
	${CMAKE_CURRENT_SOURCE_DIR}/node_modules/nbind/src/em/Binding.cc
	${CMAKE_CURRENT_SOURCE_DIR}/node_modules/nbind/src/common.cc
	${CMAKE_CURRENT_SOURCE_DIR}/node_modules/nbind/src/reflect.cc
	yoga/javascript/sources/Config.cc
	yoga/javascript/sources/Node.cc
)

set(EMCC_ARGS
	--extern-pre-js ${YOGA_FRONT_MATTER_FILE}
	--js-library ${NBIND_LIB_FILE}
	--post-js glue.js
	--post-js ${YOGA_ONLOAD_FILE}
	-Oz
	-s ALLOW_MEMORY_GROWTH=1
	-s NO_FILESYSTEM=1
	-s MODULARIZE=1
	-s ASSERTIONS=0
	-DNDEBUG
	-s MALLOC="emmalloc"
	-s EXPORT_NAME="Yoga"
	--no-entry
	--no-heap-copy
)

set(EMCC_WASM_ARGS ${EMCC_ARGS}
	-I${CMAKE_CURRENT_SOURCE_DIR}
	-I${CMAKE_CURRENT_SOURCE_DIR}/yoga
	-s ERROR_ON_UNDEFINED_SYMBOLS=0
  -s BINARYEN_IGNORE_IMPLICIT_TRAPS=1
  -s WASM=1
	-s SINGLE_FILE=1)

set(EMCC_GLUE_ARGS
  -c
	-I${CMAKE_CURRENT_SOURCE_DIR}/node_modules/nbind/include
	-I${CMAKE_CURRENT_SOURCE_DIR}/yoga
  -include${YOGA_HEADER_FILE}
	-s MALLOC="emmalloc"
	-s ASSERTIONS=0
	-fexceptions)

set(CMAKE_C_FLAGS "${CMAKE_C_FLAGS} -Oz \
		-s ALLOW_MEMORY_GROWTH=1 \
		-s ASSERTIONS=0 \
		-DNDEBUG \
		--no-entry \
		--no-heap-copy \
		-s MALLOC=\"emmalloc\"")

add_custom_command(
	OUTPUT .yoga-patch
	COMMAND cd ${CMAKE_CURRENT_SOURCE_DIR}/yoga && git apply ../src/yoga.patch || true && cd - && touch .yoga-patch
	COMMENT "Applying Yoga patch to fix missing Node::setFlexBasisAuto implementation"
	VERBATIM)
add_custom_target(yoga-patch ALL DEPENDS .yoga-patch)

add_custom_command(
	OUTPUT ${DIST}
	COMMAND cd ${CMAKE_CURRENT_SOURCE_DIR} && rm -rf dist && mkdir -p dist && cd -
	COMMENT "Creating Yoga distribution directory"
	VERBATIM)
add_custom_target(yoga-dist ALL DEPENDS ${DIST})

add_custom_command(
	OUTPUT glue.cpp glue.js
	BYPRODUCTS parser.out WebIDLGrammar.pkl
	COMMAND ${PYTHON} ${WEBIDL_BINDER_SCRIPT} ${YOGA_IDL_FILE} glue
	DEPENDS ${YOGA_IDL_FILE}
	COMMENT "Generating Yoga bindings"
	VERBATIM)

add_custom_command(
	OUTPUT glue.o
	COMMAND emcc glue.cpp ${EMCC_GLUE_ARGS} -o glue.o
	DEPENDS glue.cpp ${YOGA_HEADER_FILE}
	COMMENT "Building Yoga bindings"
	VERBATIM)
add_custom_target(yoga-bindings ALL DEPENDS glue.js glue.o)

add_custom_command(
	OUTPUT ${DIST}/yoga.js
	COMMAND emcc glue.o libyoga.bc ${EMCC_WASM_ARGS} -o ${DIST}/yoga.js
	DEPENDS yoga-bindings ${YOGA_FRONT_MATTER_FILE} ${YOGA_ONLOAD_FILE} ${NBIND_LIB_FILE} yoga glue.cpp glue.js ${DIST}
	COMMENT "Building Yoga webassembly"
	VERBATIM)
add_custom_target(yoga-wasm ALL DEPENDS ${DIST}/yoga.js)

add_library(yoga ${SRC_FILES})
add_dependencies(yoga yoga-patch)
target_link_libraries(yoga)
set_target_properties( yoga PROPERTIES SUFFIX ".bc" )

set(CMAKE_C_FLAGS "${CMAKE_C_FLAGS}")
set(CMAKE_CXX_FLAGS "${CMAKE_C_FLAGS}")

em_link_js_library(yoga ${libraryJsFiles})
