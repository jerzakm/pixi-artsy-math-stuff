import { Container, Graphics, Text } from "pixi.js";
import { Point, findPointWithAngle, calcAngleBetweenPoints } from "../math/coordMath";

export class GiftWrapping extends Container {
    pointArray: Point[]
    maxWidth: number
    maxHeight: number
    pointCount: number
    hull: Point[]
    g: Graphics
    wrapAngle: number
    labels: Text[]

    constructor(maxWidth: number, maxHeight: number, pointCount: number){
        super()
        this.pointArray = []
        this.hull = []
        this.maxWidth = maxWidth
        this.maxHeight = maxHeight
        this.pointCount = pointCount
        this.g = new Graphics()
        this.labels = []
        this.addChild(this.g)
        this.populate()
        this.findOrigin()
        this.wrapAngle = 0
    }

    private populate(){
        for(let i = 0; i<this.pointCount; i++){
            this.pointArray.push({
                x: Math.floor(Math.random()*this.maxWidth),
                y: Math.floor(Math.random()*this.maxHeight),
            })
        }
    }

    public animate(delta: number){
        this.g.clear()
        this.drawPoints()
        this.drawHull()
        this.wrap()
    }

    private findOrigin(){
        this.pointArray = this.pointArray.sort((a,b)=> {
            return a.x - b.x
        })
        this.hull.push(this.pointArray[0])
    }

    private drawPoints(){
        this.g.beginFill(0xFFFFFF)
        for(const point of this.pointArray){            
            this.g.drawCircle(point.x, point.y, 3)
        }
        this.g.endFill()
    }

    private drawHull(){        
        this.g.lineStyle(2, 0xFF1212)
        for(const point of this.hull){            
            this.g.drawCircle(point.x, point.y, 7)
        }        
    }

    private wrap(){
        if(this.labels.length!= this.pointArray.length) {
            const p1 = this.pointArray[0]
            for(const p of this.pointArray){
                const angle = calcAngleBetweenPoints(p1,p)
                const basicText = new Text(`${angle.toFixed(1)}`, {fontSize: 12});
                basicText.x = p.x;
                basicText.y = p.y;
                this.labels.push(basicText)
                this.addChild(basicText)
            }            
        }        
        
        // const armSize = 800
        // const current = this.hull[this.hull.length-1]
        // const last = this.hull.length>1 ? this.hull[this.hull.length] : {x: this.hull[0].x, y:this.hull[0].y+armSize}        

        // const lastAngled = findPointWithAngle(last, this.wrapAngle, armSize)
        // this.wrapAngle -= 0.25

        // this.g.moveTo(current.x, current.y)
        // this.g.lineTo(lastAngled.x, lastAngled.y)
    }
}