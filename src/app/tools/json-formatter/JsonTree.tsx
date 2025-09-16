import React, { useState } from "react";

// 类型安全定义 JSON 值
export type JsonValue = string | number | boolean | null | JsonObject | JsonArray;
export interface JsonObject { [key: string]: JsonValue }
export type JsonArray = JsonValue[];

interface JsonTreeProps {
  data: JsonValue;
  level?: number;
}

const isObject = (val: JsonValue): val is JsonObject => val !== null && typeof val === "object" && !Array.isArray(val);
const isArray = (val: JsonValue): val is JsonArray => Array.isArray(val);

const JsonTree: React.FC<JsonTreeProps> = ({ data, level = 0 }) => {
  const [collapsed, setCollapsed] = useState(false);

  if (!isObject(data) && !isArray(data)) {
    return <span className="text-green-700">{JSON.stringify(data)}</span>;
  }

  const entries: [string | number, JsonValue][] = isArray(data)
    ? (data as JsonArray).map((v, i) => [i, v])
    : Object.entries(data as JsonObject);

  return (
    <div className="pl-4 border-l border-muted/30">
      <button
        className="mr-2 text-xs text-gray-400 hover:text-blue-500"
        onClick={() => setCollapsed((c) => !c)}
        aria-label={collapsed ? "展开" : "折叠"}
        type="button"
      >
        {collapsed ? "▶" : "▼"}
      </button>

      <span className="text-gray-500">{isArray(data) ? "[" : "{"}</span>

      {!collapsed && (
        <div className="ml-4">
          {entries.map(([key, value], idx) => (
            <div key={String(key)} className="flex items-start">
              <span className="text-blue-600 font-bold mr-1">{isArray(data) ? null : `\"${key}\"`} </span>
              {isArray(data) ? null : <span className="text-gray-500">: </span>}
              <JsonTree data={value} level={level + 1} />
              {idx < entries.length - 1 && <span className="text-gray-400 ml-1">,</span>}
            </div>
          ))}
        </div>
      )}

      <span className="text-gray-500">{isArray(data) ? "]" : "}"}</span>
    </div>
  );
};

export default JsonTree;
