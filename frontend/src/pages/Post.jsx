import React from 'react'
import Styles from "../css/meow.module.css"
import {Link} from "react-router-dom"

export default function Post({title, summary, image, content, createdAt, author, _id}) {
return (

    <div className={Styles.post}>
        <div className={Styles.image}>
            <img src={image} alt=""></img>
        </div>
        <div className={Styles.info}>
            <div dangerouslySetInnerHTML={{__html:content}}></div> 
            <div className="author">
                <Link to={`/userProfile/${author.username}`}>
                    {author.username}
                </Link>
            </div>
        </div>  
    </div>
)
}   