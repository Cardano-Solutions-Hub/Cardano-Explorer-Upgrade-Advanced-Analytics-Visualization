/* eslint-disable react/prop-types */
function Table({ headers, bodies }) {
  return (
    <div className="flex justify-center">
      <div className="w-[95%] overflow-x-auto">
        <table className="table w-full border-separate border-spacing-y-2">
          {/* head */}
          <thead>
            <tr className="bg-secondaryBg text-white">
              {headers.map((header, index) => (
                <th key={index}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {bodies.map((row, rowIndex) => (
              <tr key={rowIndex} className="bg-tableBg">
                {row.content.map((cell, cellIndex) => (
                  <td key={cellIndex} className={cell.style || 'text-primaryTableText'}>
                    {/* Check for isDiv property and render accordingly */}
                    {cell.isDiv ? (
                      <div>{cell.value}</div> // Render as a div if isDiv is true
                    ) : (
                      cell.value // Render normally if isDiv is false
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Table;
