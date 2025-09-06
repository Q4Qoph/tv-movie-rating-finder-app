import { useEffect, useState } from "react"


const useFetch = <T>(fetchFunction:()=> Promise<T>, autoFetch = true) => {
    const [data, setData] = useState<T | null>(null);
    const [loading, settLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const fetchData = async() =>{
        try{
            settLoading(true);
            setError(null)

            const result = await fetchFunction();
            setData(result);
        }catch (err){
            //@ts-ignore
            setError(err instanceof Error ? err : new Error('An error ocurred'));
        }finally{
            settLoading(false);
        }
    }

    const reset = () => {
        setData(null);
        settLoading(false);
        setError(null);
    }
    useEffect(() => {
        if(autoFetch){
            fetchData();
        }
    },[]);

    return {data, loading, error, refetch: fetchData, reset};    
}
export default useFetch