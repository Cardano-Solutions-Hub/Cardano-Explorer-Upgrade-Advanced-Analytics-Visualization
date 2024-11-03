/* eslint-disable react/prop-types */
function InfoCard({ image, title, body, width}) {
  return (
    <div className="mt-4">
      <div className="flex flex-row">
        <div className="bg-cardBg p-4 flex flex-col justify-center items-center h-24">
          <img src={image} width={width || 60}/>
        </div>

        <div className="bg-secondaryBg px-12 flex flex-col justify-center items-center leading-6">
          <p className="font-semibold text-white text-lg md:text-base sm:text-sm">{title}</p>
          <p className="font-bold text-white text-lg md:text-base sm:text-sm">{body}</p>
        </div>
      </div>
    </div>
  );
}

export default InfoCard;
