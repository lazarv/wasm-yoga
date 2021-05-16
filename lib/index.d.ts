interface YGBase {
  ptr: number;
}

declare enum YGAlign {
  "YGAlignAuto",
  "YGAlignFlexStart",
  "YGAlignCenter",
  "YGAlignFlexEnd",
  "YGAlignStretch",
  "YGAlignBaseline",
  "YGAlignSpaceBetween",
  "YGAlignSpaceAround",
}
declare enum YGDimension {
  "YGDimensionWidth",
  "YGDimensionHeight",
}
declare enum YGDirection {
  "YGDirectionInherit",
  "YGDirectionLTR",
  "YGDirectionRTL",
}
declare enum YGDisplay {
  "YGDisplayFlex",
  "YGDisplayNone",
}
declare enum YGEdge {
  "YGEdgeLeft",
  "YGEdgeTop",
  "YGEdgeRight",
  "YGEdgeBottom",
  "YGEdgeStart",
  "YGEdgeEnd",
  "YGEdgeHorizontal",
  "YGEdgeVertical",
  "YGEdgeAll",
}
declare enum YGExperimentalFeature {
  "YGExperimentalFeatureWebFlexBasis",
}
declare enum YGFlexDirection {
  "YGFlexDirectionColumn",
  "YGFlexDirectionColumnReverse",
  "YGFlexDirectionRow",
  "YGFlexDirectionRowReverse",
}
declare enum YGJustify {
  "YGJustifyFlexStart",
  "YGJustifyCenter",
  "YGJustifyFlexEnd",
  "YGJustifySpaceBetween",
  "YGJustifySpaceAround",
  "YGJustifySpaceEvenly",
}
declare enum YGMeasureMode {
  "YGMeasureModeUndefined",
  "YGMeasureModeExactly",
  "YGMeasureModeAtMost",
}
declare enum YGOverflow {
  "YGOverflowVisible",
  "YGOverflowHidden",
  "YGOverflowScroll",
}
declare enum YGPositionType {
  "YGPositionTypeStatic",
  "YGPositionTypeRelative",
  "YGPositionTypeAbsolute",
}
declare enum YGUnit {
  "YGUnitUndefined",
  "YGUnitPoint",
  "YGUnitPercent",
  "YGUnitAuto",
}
declare enum YGWrap {
  "YGWrapNoWrap",
  "YGWrapWrap",
  "YGWrapWrapReverse",
}

interface YGConfig extends YGBase {
  setExperimentalFeatureEnabled(
    feature: YGExperimentalFeature,
    enabled: boolean
  ): void;
  setPointScaleFactor(pixelsInPoint: number): void;
  isExperimentalFeatureEnabled(feature: YGExperimentalFeature): boolean;
}

interface YGConfigStatic {
  new ();
  create(): YGConfig;
  destroy(config: YGConfig): void;
}

interface YGSize extends YGBase {
  width: number;
  height: number;
}

interface YGSizeStatic {
  new (): YGSize;
  new (width: number, height: number): YGSize;
}

interface YGValue extends YGBase {
  unit: YGUnit;
  value: number;
}

interface YGLayout extends YGBase {
  left: number;
  right: number;
  top: number;
  bottom: number;
  width: number;
  height: number;
}

type YGMeasureFunc = (
  width: number,
  widthMode: YGMeasureMode,
  height: number,
  heightMode: YGMeasureMode
) => YGSize;

type YGDirtiedFunc = () => void;

interface YGNode extends YGBase {
  // Style setters
  copyStyle(other: YGNode): void;

  setPositionType(positionType: YGPositionType): void;
  setPosition(edge: YGEdge, position: number): void;
  setPositionPercent(edge: YGEdge, position: number): void;

  setAlignContent(alignContent: YGAlign): void;
  setAlignItems(alignItems: YGAlign): void;
  setAlignSelf(alignSelf: YGAlign): void;
  setFlexDirection(flexDirection: YGFlexDirection): void;
  setFlexWrap(flexWrap: YGWrap): void;
  setJustifyContent(justifyContent: YGJustify): void;

  setMargin(edge: YGEdge, margin: number): void;
  setMarginPercent(edge: YGEdge, margin: number): void;
  setMarginAuto(edge: YGEdge): void;

  setOverflow(overflow: YGOverflow): void;
  setDisplay(display: YGDisplay): void;

  setFlex(flex: number): void;
  setFlexBasis(flexBasis: number): void;
  setFlexBasisPercent(flexBasis: number): void;
  setFlexBasisAuto(): void;
  setFlexGrow(flexGrow: number): void;
  setFlexShrink(flexShrink: number): void;

  setWidth(width: number): void;
  setWidthPercent(width: number): void;
  setWidthAuto(): void;
  setHeight(height: number): void;
  setHeightPercent(height: number): void;
  setHeightAuto(): void;

  setMinWidth(minWidth: number): void;
  setMinWidthPercent(minWidth: number): void;
  setMinHeight(minHeight: number): void;
  setMinHeightPercent(minHeight: number): void;

  setMaxWidth(maxWidth: number): void;
  setMaxWidthPercent(maxWidth: number): void;
  setMaxHeight(maxHeight: number): void;
  setMaxHeightPercent(maxHeight: number): void;

  setAspectRatio(aspectRatio: number): void;

  setBorder(edge: YGEdge, border: number): void;

  setPadding(edge: YGEdge, padding: number): void;
  setPaddingPercent(edge: YGEdge, padding: number): void;

  // Style getters
  getPositionType(): YGPositionType;
  getPosition(edge: YGEdge): YGValue;

  getAlignContent(): YGAlign;
  getAlignItems(): YGAlign;
  getAlignSelf(): YGAlign;
  getFlexDirection(): YGFlexDirection;
  getFlexWrap(): YGWrap;
  getJustifyContent(): YGJustify;

  getMargin(edge: YGEdge): YGValue;

  getOverflow(): YGOverflow;
  getDisplay(): YGDisplay;

  getFlexBasis(): YGValue;
  getFlexGrow(): number;
  getFlexShrink(): number;

  getWidth(): YGValue;
  getHeight(): YGValue;

  getMinWidth(): YGValue;
  getMinHeight(): YGValue;

  getMaxWidth(): YGValue;
  getMaxHeight(): YGValue;

  getAspectRatio(): number;

  getBorder(edge: YGEdge): number;

  getPadding(edge: YGEdge): YGValue;

  // Tree hierarchy mutators
  insertChild(child: YGNode, index: number): void;
  removeChild(child: YGNode): void;

  // Tree hierarchy inspectors
  getChildCount(): number;

  // The following functions cannot be const because they could discard const
  // qualifiers (ex: constNode->getChild(0)->getParent() wouldn't be const)

  getParent(): YGNode;
  getChild(index: number): YGNode;

  // Measure func mutators
  setMeasureFunc(measureFunc: YGMeasureFunc): void;
  unsetMeasureFunc(): void;

  // Dirtied func mutators
  setDirtiedFunc(dirtiedFunc: YGDirtiedFunc): void;
  unsetDirtiedFunc(): void;

  // Dirtiness accessors
  markDirty(): void;
  isDirty(): boolean;

  // Layout mutators
  calculateLayout(width: number, height: number, direction: YGDirection): void;

  // Layout inspectors
  getComputedLeft(): number;
  getComputedRight(): number;

  getComputedTop(): number;
  getComputedBottom(): number;

  getComputedWidth(): number;
  getComputedHeight(): number;

  getComputedLayout(): YGLayout;

  getComputedMargin(edge: YGEdge): number;
  getComputedBorder(edge: YGEdge): number;
  getComputedPadding(edge: YGEdge): number;

  setIsReferenceBaseline(isReferenceBaseline: boolean): void;
  isReferenceBaseline(): boolean;
}

interface YGNodeStatic {
  new ();
  createDefault(): YGNode;
  createWithConfig(config: YGConfig): YGNode;
  destroy(node: YGNode): void;
}

type EnumKeys<T> = { [key in keyof T]: number };
type Yoga = EnumKeys<typeof YGAlign> &
  EnumKeys<typeof YGDimension> &
  EnumKeys<typeof YGDirection> &
  EnumKeys<typeof YGDisplay> &
  EnumKeys<typeof YGEdge> &
  EnumKeys<typeof YGExperimentalFeature> &
  EnumKeys<typeof YGFlexDirection> &
  EnumKeys<typeof YGJustify> &
  EnumKeys<typeof YGMeasureMode> &
  EnumKeys<typeof YGOverflow> &
  EnumKeys<typeof YGPositionType> &
  EnumKeys<typeof YGUnit> &
  EnumKeys<typeof YGWrap> & {
    Config: YGConfigStatic;
    Node: YGNodeStatic;
    Size: YGSizeStatic;
  };

declare module "@lazarv/wasm-yoga" {
  function initYoga(): Promise<Yoga>;

  export = initYoga;
}
