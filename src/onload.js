Module.Config.create = Module.Config.prototype.create;
delete Module.Config.prototype.create;

Module.Config.destroy = Module.Config.prototype.destroy;
delete Module.Config.prototype.destroy;

Module.Node.createDefault = Module.Node.prototype.createDefault;
delete Module.Node.prototype.createDefault;

Module.Node.createWithConfig = Module.Node.prototype.createWithConfig;
delete Module.Node.prototype.createWithConfig;

Module.Node.destroy = Module.Node.prototype.destroy;
delete Module.Node.prototype.destroy;

const orig__setMeasureFunc = Module.Node.prototype.setMeasureFunc;
Module.Node.prototype.setMeasureFunc = function (fn) {
  return orig__setMeasureFunc.call(
    this,
    __nbind_register_callback_signature_handler(this, fn)
  );
};

const orig__setDirtiedFunc = Module.Node.prototype.setDirtiedFunc;
Module.Node.prototype.setDirtiedFunc = function (fn) {
  return orig__setDirtiedFunc.call(
    this,
    __nbind_register_callback_signature_handler(this, fn)
  );
};

const orig__getComputedLayout = Module.Node.prototype.getComputedLayout;
Module.Node.prototype.getComputedLayout = function () {
  const layout = orig__getComputedLayout.call(this);

  const [left, right, top, bottom, width, height] = Module.HEAPF64.slice(
    layout.ptr / 8,
    layout.ptr / 8 + 6
  );
  return Object.assign(Object.create(Module.Layout.prototype), {
    ptr: layout.ptr,
    left,
    right,
    top,
    bottom,
    width,
    height,
  });
};

function patchNodeValueGetter(name) {
  const orig__getter = Module.Node.prototype[name];
  Module.Node.prototype[name] = function () {
    const value = orig__getter.call(this);

    value.unit = Module.HEAP32[value.ptr / 4];
    value.value = Module.HEAPF64[value.ptr / 8 + 1];

    return value;
  };
}

[
  "getPosition",
  "getMargin",
  "getFlexBasis",
  "getWidth",
  "getHeight",
  "getMinWidth",
  "getMinHeight",
  "getMaxWidth",
  "getMaxHeight",
  "getPadding",
].forEach((getter) => patchNodeValueGetter(getter));
