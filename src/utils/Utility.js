export const getCurrentUserId = (req) => req?.user?._id || "";

export const checkMissingFields = (varArr)=>{
    if (!varArr || !varArr.length) return false;
    return varArr.some((ele) => {
        if ((typeof ele === 'string' || ele instanceof String))
            return ele.trim() === ""
        else
            return !ele
    })
}