function change_icon(pic) {
  const linkPic = pic.src;
  if(linkPic.indexOf("kopref") !== -1) {
    pic.src = "../../img/okpref.svg";
  } else {
    pic.src = "../../img/kopref.svg";
  }
}