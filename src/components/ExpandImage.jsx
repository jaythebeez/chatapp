const ExpandImage = ({src, handleExpand}) => {

    const handleClick = (e) => {
        console.log("clicked", e)
        e.stopPropagation();
    }
    return ( 
        <div className="fixed w-full h-full top-0 left-0 bg-gray-600/75 z-20 flex items-center justify-center" onClick={(e)=>handleExpand(e)} >
            <div onClick={handleClick} className="w-[90%] max-w-[750px]">
                <img src={src} className="object-contain w-full" />
            </div>
        </div>
    );
}
 
export default ExpandImage;