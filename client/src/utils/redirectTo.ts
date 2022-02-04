const redirectTo = (link: string)=>{

    return link.replace(window.location.origin, '');

}

export default redirectTo;