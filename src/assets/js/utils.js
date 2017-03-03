//获取css样式
function getStyle(attr,obj){
      if(typeof getComputedStyle=="function"){
       return window.getComputedStyle(obj,null)[attr];
     }else{
       return obj.currentStyle[attr];
         }

}
//运动模式
 function startMove(obj,json,fn){
  clearInterval(obj.timer);
    obj.timer=setInterval(function(){
    var flag=true;
    for(var attr in json){
     if(attr=="opacity"){
  var temp=parseInt(parseFloat(getStyle(attr,obj))*100);
       }else{
    var temp=parseInt(getStyle(attr,obj));
       }
  var speed=(json[attr]-temp)/6;
      speed=speed>0?Math.ceil(speed):Math.floor(speed);
      if(temp!=json[attr]){
            flag=false;
      }
    if(attr=="opacity"){
  obj.style.opacity=(temp+speed)/100;
  obj.style.filter='alpha(opacity='+(temp+speed)+')';
     }else{
   obj.style[attr]=temp+speed+'px';
         }
              }
    if(flag){
       clearInterval(obj.timer);
       if(fn!=undefined){
        fn();
       }
        }
  },30);
}
// 返回指定位置
function returnAppointPos(target) {
  let timer = setInterval(() => {
  let t = document.documentElement.scrollTop || document.body.scrollTop;
  // 运动模式
  let speed = (target - t) / 8;
  speed = speed > 0 ? Math.ceil(speed) : Math.floor(speed);
  document.documentElement.scrollTop = document.body.scrollTop = speed + t;
  if (speed === 0) {
    clearInterval(timer);
  }
  },500 / 60);
}
export {startMove, returnAppointPos};
