import { Container, Graphics, interaction } from 'pixi.js'
import * as Color from 'color'
import { Line } from '../math/shapes';

export class PolygonCutting extends Container {
    polygons: ICuttablePolygon[]
    g: Graphics
    cuttingLine: Line | null

    constructor(polygons?: ICuttablePolygon[]) {
        super()
        polygons? this.polygons = polygons: this.polygons = []
        this.g = new Graphics()
        this.addChild(this.g)
        this.cuttingLine = null
    }

    public animate(){
        this.g.clear()
        for(const polygon of this.polygons) {
            const color = parseInt(polygon.color.hex().replace('#','0x'),16)
            this.g.beginFill(color)
            this.g.drawPolygon(polygon.points)
            this.g.endFill()
        }

        if(this.cuttingLine){
            this.g.lineStyle(1, 0xFFFFFF)
            this.g.moveTo(this.cuttingLine.from.x,this.cuttingLine.from.y)
            this.g.lineTo(this.cuttingLine.to.x,this.cuttingLine.to.y)
        }
    }

    public draggingSetup() {
        let dragging = false

        let from = {
            x: 0,
            y: 0
        }

        window.addEventListener('pointerdown', (e)=> {            
            dragging = true

            from.x = e.screenX
            from.y = e.screenY
        })
        window.addEventListener('pointerup', ()=> {
            dragging = false
            this.cuttingLine = null
        })
        window.addEventListener('pointerupoutside', ()=> {
            dragging = false
            this.cuttingLine = null
        })
        window.addEventListener('pointermove', (e)=> {
            if(dragging){
                this.cuttingLine = {
                    from: from,
                    to: {
                        x:e.screenX,
                        y:e.screenY
                    }
                }                
            }
        })
      }
}

export interface ICuttablePolygon {
    points: number[]
    color: Color
}