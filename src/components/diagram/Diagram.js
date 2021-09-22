/** @jsxImportSource @emotion/react */
function Diagram({ size }) {
  const canvasID = "my-canvas";
  const containerCSS = { border: "1px solid blue", width: size };
  return (
    <div style={containerCSS}>
      <canvas
        id={canvasID}
        width={size}
        height={size}
        onMouseMove={(e) => {
          const canvas = e.target;
          const rect = canvas.getBoundingClientRect();
          const x = e.clientX - Math.floor(rect.x);
          // console.log("e.clientY, rect.y", e.clientY, rect.y);
          const y = e.clientY - Math.floor(rect.y);

          console.log("(x,y)=(", x, ",", y, ")");
        }}
      ></canvas>
    </div>
  );
}

export default Diagram;
