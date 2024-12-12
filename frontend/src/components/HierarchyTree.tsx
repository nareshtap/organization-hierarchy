import { useEffect } from "react";
import Tree from "react-d3-tree";
import "./style.css";
import NotFound from "./NotFound";

export interface Node {
  designation_name: string;
  children?: Node[];
  employees?: {
    employeeName: string;
  }[];
}

interface transformToTreeData {
  name: string,
  children: transformToTreeData[]
}

interface HierarchyTreeProps {
  fetchHierarchy: () => void;
  data: Node[];
}
const HierarchyTree: React.FC<HierarchyTreeProps> = ({ fetchHierarchy, data }) => {


  useEffect(() => {
    fetchHierarchy();
  }, []);

  const transformToTreeData = (nodes: Node[]): transformToTreeData[] =>
    nodes.map((node) => ({
      name: node.designation_name,
      children: transformToTreeData(node.children || []),
    }));

  return data.length ? (
    <div className="treeNodeWrap">
      <div
        style={{
          width: "100%",
          height: "100%",
          border: "1px solid #000000",
          borderRadius: "5px",
          background: "#eaeaea",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Tree
          translate={{ x: 500, y: 50 }}
          rootNodeClassName="node__root"
          zoomable={true}
          orientation="vertical"
          data={transformToTreeData(data)}
          enableLegacyTransitions={true}
        />
      </div>
    </div>
  ) : (
    <NotFound />
  );
};

export default HierarchyTree;
