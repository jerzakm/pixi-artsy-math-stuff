import { Container, Graphics } from "pixi.js";
import { Point } from "../math/coordMath";

export class GiftWrapping extends Container {
    pointArray: Point[]
    maxWidth: number
    maxHeight: number
    pointCount: number
    hull: Point[]
    g: Graphics

    constructor(maxWidth: number, maxHeight: number, pointCount: number){
        super()
        this.pointArray = []
        this.hull = []
        this.maxWidth = maxWidth
        this.maxHeight = maxHeight
        this.pointCount = pointCount
        this.g = new Graphics()
        this.addChild(this.g)
        this.populate()
        this.findOrigin()
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

    }
}

enum Side {
    TOP, BOTTOM, LEFT, RIGHT
}