//環境變數
var updateFPS = 30
var showMouse = true
var time = 0
var bgColor ="black"

//控制
var controls = {
  value: 0
}
var gui = new dat.GUI()
// gui.add(controls,"value",-2,2).step(0.01).onChange(function(value){})

//------------------------
// Vec2

class Vec2{
  constructor(x,y){
    this.x = x
    this.y = y
  }
  set(x,y){
    this.x =x
    this.y =y
  }
  move(x,y){
    this.x+=x
    this.y+=y
  }
  add(v){
    return new Vec2(this.x+v.x,this.y+v.y)
  }
  sub(v){
    return new Vec2(this.x-v.x,this.y-v.y)
  }
  mul(s){
    return new Vec2(this.x*s,this.y*s)
  }
  get length(){
    return Math.sqrt(this.x*this.x+this.y*this.y)
  }
  set length(nv){
    let temp = this.unit.mul(nv)
    this.set(temp.x,temp.y)
  }
  clone(){
    return new Vec2(this.x,this.y)
  }
  toString(){
    return `(${this.x}, ${this.y})`
  }
  equal(v){
    return this.x==v.x && this.y ==v.y
  }
  get angle(){
    return Math.atan2(this.y,this.x)  
  }
  get unit(){
    return this.mul(1/this.length)
  }
  
}
var a = new Vec2(3,4)

//------



var canvas = document.getElementById("mycanvas")
var ctx = canvas.getContext("2d")
ctx.circle= function(v,r){
  this.arc(v.x,v.y,r,0,Math.PI*2)
}
ctx.line= function(v1,v2){
  this.moveTo(v1.x,v1.y)
  this.lineTo(v2.x,v2.y)
}


function initCanvas(){
  ww = canvas.width = window.innerWidth
  wh = canvas.height = window.innerHeight
}
initCanvas()

let degToPi = Math.PI/180
class Circle {
  constructor(args){
    let def ={
      p: new Vec2(0,0),
      r: 100,
      color: "white",
      lineTo: function(obj,i){
        return true
      },
      getWidth: function(obj,i){
        return 1
      },
      anglePan: function(obj,i){
        return 0
      },
      vertical: false,
      getVerticalWidth: function(obj,i){
        return 2
      },
      ramp: 0,
      
    }
    Object.assign(def,args)
    Object.assign(this,def)
  }
  draw(){
    ctx.beginPath()
    for(var i=1;i<=360;i++){
      let angle1 = i + this.anglePan()
      let angle2 = i-1 + this.anglePan()
      let use_r = this.r +this.ramp*Math.sin(i/10)
      let use_r2 = this.r +this.ramp*Math.sin( (i-1)/10 )
      
      let x1 = use_r *Math.cos(angle1*degToPi)
      let y1 = use_r *Math.sin(angle1*degToPi)
      let x2 = use_r2 *Math.cos(angle2*degToPi)
      let y2 = use_r2 *Math.sin(angle2*degToPi)
      
      if (this.lineTo(this,i)){
        ctx.beginPath()
        ctx.moveTo(x1,y1)
        ctx.lineTo(x2,y2)
        ctx.strokeStyle=this.color
        ctx.lineWidth= this.getWidth(this,i)
        ctx.stroke()
        
      }
      if (this.vertical){
        let l = this.getVerticalWidth(this,i)
        let x3 = (use_r+l)*Math.cos(angle1*degToPi)
        let y3 = (use_r+l)*Math.sin(angle1*degToPi)
        
        
        ctx.beginPath()
        ctx.moveTo(x1,y1)
        ctx.lineTo(x3,y3)
        ctx.strokeStyle=this.color
        ctx.stroke()
      }
      
    }
  }
}

let cirs= []
function init(){
  cirs.push(new Circle({
    r: 150,
    color: "rgba(255,255,255,0.4)"
  }))
  
  cirs.push(new Circle({
    r: 220,
    lineTo: function(obj,i){
      return (i%2==0)
    },
    color: "rgba(255,255,255,1)"
  }))
  
  cirs.push(new Circle({
    r: 80,
    lineTo: function(obj,i){
      return !(i%180<30)
    }
  }))
  
   cirs.push(new Circle({
    r: 320,
    ramp: 15,
    color: "rgba(255,255,255,0.8)"
  }))
  
  cirs.push(new Circle({
    r: 190,
    getWidth:function(obj,i){
      return i%150<50?5: 1
    },
    color: "rgba(255,255,255,0.8)",
     anglePan: function(obj,i){
       return -40*Math.sin(time/400)
     },
  }))
  
   cirs.push(new Circle({
    r: 300,
    lineTo(obj,i){
      return false
    },
     anglePan: function(obj,i){
       return 40*Math.sin(time/200)
     },
   vertical: true,
     getVerticalWidth(obj,i){
       
       if (i%10==0){
         return 10
       }
       if (i%5==0){
         return 5
       }
       return 2
     },
    color: "rgba(255,255,255,0.8)"
  }))
  
  cirs.push(new Circle({
    r: 280,
    lineTo: function(obj,i){
      return i%50==0
    },
    getWidth: function(obj,i){
      return 10
    },
    anglePan: function(obj,i){
      return (-time/20)%5
    },
    color: "rgba(255,255,255,0.8)",
     
  }))
  
}
function update(){
  time++
}
function draw(){
   //清空背景
  ctx.fillStyle=bgColor
  ctx.fillRect(0,0,ww,wh)
  
  //-------------------------
  //   在這裡繪製
  
  ctx.save()
    ctx.translate(ww/2,wh/2)
    cirs.forEach(cir=>{
      ctx.save()
        let pan = mousePos.sub(new Vec2(ww/2,wh/2)).mul(2/cir.r)
        ctx.translate(pan.x,pan.y)
        cir.draw()
      ctx.restore()
    })
  ctx.fillStyle='white'
  ctx.fillRect(0,-20,120,20)
  ctx.fillStyle="black"
  ctx.fillText(Date.now(),5,-5)
  
  
  let h = new Date().getHours()
  let m = new Date().getMinutes()
  let s = new Date().getSeconds()
  
  let angleHour = degToPi*360/12 *h- Math.PI/2
  ctx.beginPath()
  ctx.moveTo(0,0)
  ctx.lineTo(50*Math.cos(angleHour),50*Math.sin(angleHour))
  ctx.lineWidth=5
  ctx.strokeStyle="red"
  ctx.stroke()
  
  let angleMinute = degToPi*360/60 *m- Math.PI/2
  ctx.beginPath()
  ctx.moveTo(0,0)
  ctx.lineTo(100*Math.cos(angleMinute),100*Math.sin(angleMinute))
  ctx.lineWidth=2
  ctx.strokeStyle="white"
  ctx.stroke()
  
  let angleSecond = degToPi*360/60 *s- Math.PI/2
  ctx.beginPath()
  ctx.moveTo(0,0)
  ctx.lineTo(140*Math.cos(angleSecond),140*Math.sin(angleSecond))
  ctx.lineWidth=1
  ctx.strokeStyle="white"
  ctx.stroke()
  
  
  ctx.restore()
  
  
  let crosses= [
    new Vec2(50,50),
    new Vec2(ww-50,50),
    new Vec2(50,wh-50),
    new Vec2(ww-50,wh-50)
  ]
  crosses.forEach(cross=>{
    ctx.beginPath()
    ctx.save()
      ctx.translate(cross.x,cross.y)
      ctx.moveTo(0,-10)
      ctx.lineTo(0,10)
      ctx.moveTo(-10,0)
      ctx.lineTo(10,0)
    ctx.lineWidth=2
    ctx.strokeStyle="white"
    ctx.stroke()
    
    ctx.restore()
  })
  
  
  
  //-----------------------
  //繪製滑鼠座標
  
  ctx.fillStyle="red"
  ctx.beginPath()
  ctx.circle(mousePos,2)
  ctx.fill()
  
  ctx.save()
  ctx.beginPath()
  ctx.translate(mousePos.x,mousePos.y)
    ctx.strokeStyle="red"
    let len = 20
    ctx.line(new Vec2(-len,0),new Vec2(len,0))
    ctx.line(new Vec2(0,-len),new Vec2(0,len))
    ctx.fillText(mousePos,10,-10)
    ctx.stroke()
  ctx.restore()
  
  //schedule next render

  requestAnimationFrame(draw)
}
function loaded(){
  initCanvas()
  init()
  requestAnimationFrame(draw)
  setInterval(update,1000/updateFPS)
}
window.addEventListener("load",loaded)
window.addEventListener("resize",initCanvas)

//滑鼠事件跟紀錄
var mousePos = new Vec2(0,0)
var mousePosDown = new Vec2(0,0)
var mousePosUp = new Vec2(0,0)

window.addEventListener("mousemove",mousemove)
window.addEventListener("mouseup",mouseup)
window.addEventListener("mousedown",mousedown)
function mousemove(evt){
  mousePos.set(evt.x,evt.y)
  // console.log(mousePos)
}
function mouseup(evt){
  mousePos.set(evt.x,evt.y)
  mousePosUp = mousePos.clone()
  
}
function mousedown(evt){
  mousePos.set(evt.x,evt.y)
  mousePosDown = mousePos.clone()
}