/* eslint-disable react/prop-types */
function Card({left, right, leftStyle, one}) {
    console.log(leftStyle)
    return (
        <div className="mt-4">
        <div className="flex flex-row flex-wrap shadow-lg">
          {one || 
          <div className={`${leftStyle || 'bg-tableBg'} p-4 flex flex-col justify-center items-center h-24`}>
            <div>{left}</div>
          </div>
          }
  
          <div className={`bg-secondaryBg ${one ? 'px-12 py-4' : 'px-12'} flex flex-col justify-center items-center leading-6`}>
            <div>{right}</div>
          </div>
        </div>
      </div>
    )
}

export default Card