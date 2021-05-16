function nbind() {
  let externalSeed = 0;
  _nbind.externals = new Map();
  _nbind.callbackSignatureList = {};
  const callbackHandler = function (_, num, ...args) {
    const result = _nbind.externals.get(num).handler(...args);
    return result && typeof result.ptr === "number" ? result.ptr : result;
  };

  __nbind_reference_external = (num) => {
    return num;
  };
  __nbind_free_external = (num) => {
    const external = _nbind.externals.get(num);
    _free(external.ptr);
    _nbind.externals.delete(num);
  };
  __nbind_register_callback_signature = (type) => {
    _nbind.callbackSignatureList[type] = callbackHandler;
    return type;
  };
  __nbind_register_callback_signature_handler = (node, handler) => {
    const ptr = _malloc(4);
    const num = ++externalSeed;
    Module.HEAP32[ptr / 4] = num;
    _nbind.externals.set(num, { ptr, handler });
    return ptr;
  };
}

const lib = {
  nbind__postset: "_nbind();",
  nbind,
  _nbind_reference_external: function () {},
  _nbind_free_external: function () {},
  _nbind_get_value_object: function () {},
  _nbind_register_callback_signature: function () {},
  _nbind_register_callback_signature_handler: function () {},
};

autoAddDeps(lib, "nbind");
mergeInto(LibraryManager.library, lib);
