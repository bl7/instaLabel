import React, { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"

// Mock data (replace with fetch calls later)
const demoIngredients = [
  { id: "1", name: "Tomato" },
  { id: "2", name: "Lettuce" },
  { id: "3", name: "Cheddar Cheese" },
]

const demoMenuItems = [
  { id: "1", name: "Veggie Burger" },
  { id: "2", name: "Chicken Wrap" },
]

export default function LabelPrintComponent() {
  const [connected, setConnected] = useState(false)
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([])
  const [selectedMenuItems, setSelectedMenuItems] = useState<string[]>([])

  // @ts-ignore
  const epos = typeof window !== "undefined" ? window?.epson : null
  let ePosDevice: any
  let printer: any

  useEffect(() => {
    if (epos) {
      ePosDevice = new epos.ePOSDevice()
      ePosDevice.connect(
        "192.168.192.168", // update with your printer IP
        8008,
        (result: string) => {
          if (result === "OK" || result === "SSL_CONNECT_OK") {
            ePosDevice.createDevice(
              "local_printer",
              epos.ePOSDevice.DEVICE_TYPE_PRINTER,
              { crypto: true, buffer: false },
              (dev: any, code: string) => {
                if (code === "OK") {
                  printer = dev
                  setConnected(true)
                } else {
                  console.error("CreateDevice Error", code)
                }
              }
            )
          } else {
            console.error("Connection failed:", result)
          }
        }
      )
    }
  }, [epos])

  const toggleSelection = (id: string, type: "ingredient" | "menu") => {
    if (type === "ingredient") {
      setSelectedIngredients((prev) =>
        prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
      )
    } else {
      setSelectedMenuItems((prev) =>
        prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
      )
    }
  }

  const printLabels = () => {
    if (!connected || !printer) return

    const selectedItems = [
      ...demoIngredients.filter((i) => selectedIngredients.includes(i.id)),
      ...demoMenuItems.filter((i) => selectedMenuItems.includes(i.id)),
    ]

    selectedItems.forEach((item) => {
      printer.addText(`${item.name}\n`)
      printer.addFeedLine(1)
      printer.addCut()
    })

    printer.send()
  }

  return (
    <div className="space-y-6 p-4">
      <Card>
        <CardContent className="pt-4">
          <div className="mb-2 font-semibold text-green-600">
            Printer Status: {connected ? "Connected" : "Not Connected"}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="mb-2 font-bold">Ingredients</h3>
              {demoIngredients.map((ingredient) => (
                <div key={ingredient.id} className="mb-1 flex items-center gap-2">
                  <Checkbox
                    checked={selectedIngredients.includes(ingredient.id)}
                    onCheckedChange={() => toggleSelection(ingredient.id, "ingredient")}
                  />
                  <span>{ingredient.name}</span>
                </div>
              ))}
            </div>

            <div>
              <h3 className="mb-2 font-bold">Menu Items</h3>
              {demoMenuItems.map((item) => (
                <div key={item.id} className="mb-1 flex items-center gap-2">
                  <Checkbox
                    checked={selectedMenuItems.includes(item.id)}
                    onCheckedChange={() => toggleSelection(item.id, "menu")}
                  />
                  <span>{item.name}</span>
                </div>
              ))}
            </div>
          </div>

          <Button onClick={printLabels} className="mt-6">
            Print Selected Labels
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
