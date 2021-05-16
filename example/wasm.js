const Yoga = require("../dist/yoga");
const [cmd, script, count = 100, nodeCount = 100] = process.argv;

Yoga().then(function (yoga) {
  const Node = yoga.Node;
  const root = Node.createDefault();
  root.setWidth(500);
  root.setHeight(300);
  root.setFlexDirection(yoga.YGFlexDirectionColumnReverse);
  root.setJustifyContent(yoga.YGJustifyCenter);
  root.setAlignItems(yoga.YGAlignCenter);

  for (let n = 0; n < nodeCount; n++) {
    const node = Node.createDefault();
    node.setWidth(100);
    node.setHeight(100);
    root.insertChild(node, 0);
  }

  for (let i = 0; i < count; i++) {
    root.calculateLayout(500, 300, yoga.YGDirectionLTR);
    root.getComputedLayout();

    for (let n = 0; n < nodeCount; n++) {
      const node = root.getChild(n);
      node.getComputedLayout();
    }
  }

  for (let n = 0; n < nodeCount; n++) {
    const node = root.getChild(0);
    root.removeChild(node);
    Node.destroy(node);
  }

  Node.destroy(root);
});
