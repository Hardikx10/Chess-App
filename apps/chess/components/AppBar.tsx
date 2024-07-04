import Link from "next/link"


export const AppBar=()=>{
    return(
       
        <div className="float-right text-white text-l">
                <Link className="hover:underline" href={"/signup"}>
                    Logout
                </Link>
        </div>
  
    )
}