"use client"

import React, { useEffect, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"
import { PrinterIcon } from "lucide-react"

const demoIngredients = [
  { id: 1, name: "Tomato", allergens: ["None"] },
  { id: 2, name: "Peanut Sauce", allergens: ["Peanuts"] },
  { id: 3, name: "Cheese", allergens: ["Milk"] },
]

const demoMenuItems = [
  { id: 1, name: "Cheeseburger", ingredients: ["Cheese", "Beef Patty"] },
  { id: 2, name: "Satay Skewers", ingredients: ["Chicken", "Peanut Sauce"] },
]

declare global {
  interface Window {
    epson: any
  }
}

export default function LabelPrintPage() {
  const [selectedItems, setSelectedItems] = useState<any[]>([])
  const [printDialogOpen, setPrintDialogOpen] = useState(false)
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({})
  const [tab, setTab] = useState("ingredients")
  const [connectionStatus, setConnectionStatus] = useState(false)
  const PRINTER_IP = "192.168.0.100" // change to your printer IP
  const PRINTER_PORT = 8008

  const items =
    tab === "ingredients"
      ? demoIngredients.map((item) => ({ ...item, uniqueId: `ingredient-${item.id}` }))
      : demoMenuItems.map((item) => ({ ...item, uniqueId: `menu-${item.id}` }))

  useEffect(() => {
    const initial: { [key: string]: number } = {}
    items.forEach((it) => (initial[it.uniqueId] = 1))
    setQuantities(initial)
  }, [tab])

  useEffect(() => {
    const script = document.createElement("script")
    script.src = "/epson/epos-2.26.0.js"
    script.async = true
    script.onload = () => {
      if (window.epson) {
        const epos = new window.epson.ePOSDevice()
        epos.connect(PRINTER_IP, PRINTER_PORT, (ok: boolean) => {
          setConnectionStatus(ok)
          try {
            epos.disconnect()
          } catch {}
        })
      }
    }
    document.body.appendChild(script)
  }, [])

  const toggleSelection = (item: any) => {
    setSelectedItems((prev) =>
      prev.some((i) => i.uniqueId === item.uniqueId)
        ? prev.filter((i) => i.uniqueId !== item.uniqueId)
        : [...prev, item]
    )
  }

  const openPrintDialog = (item?: any) => {
    if (item) setSelectedItems([{ ...item }])
    setPrintDialogOpen(true)
  }

  const handlePrint = () => {
    if (!window.epson) {
      alert("Epson SDK not loaded yet.")
      return
    }
    const epos = new window.epson.ePOSDevice()
    epos.connect(PRINTER_IP, PRINTER_PORT, (ok: boolean, code: string) => {
      if (!ok) {
        alert("Printer connection failed.")
        console.error("connect error:", code)
        return
      }
      epos.createDevice(
        "local_printer",
        epos.DEVICE_TYPE_PRINTER,
        { crypto: false, buffer: false },
        (dev: any, createCode: string) => {
          if (!dev) {
            alert("Failed to initialize printer.")
            console.error("createDevice error:", createCode)
            return
          }
          selectedItems.forEach((item) => {
            const qty = quantities[item.uniqueId] || 1
            for (let i = 0; i < qty; i++) {
              dev.addText(`${item.name}\n`)
              if (item.allergens) dev.addText(`Allergens: ${item.allergens.join(", ")}\n`)
              if (item.ingredients) dev.addText(`Ingredients: ${item.ingredients.join(", ")}\n`)
              dev.addFeedLine(1)
              dev.addCut()
            }
          })
          dev.send()
          setPrintDialogOpen(false)
          setSelectedItems([])
        }
      )
    })
  }

  return (
    <div className="p-6">
      {/* Printer Status Row */}
      <div className="mb-4 flex justify-end">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Printer</span>
          <div
            className={cn("h-3 w-3 rounded-full", connectionStatus ? "bg-green-500" : "bg-red-500")}
          />
        </div>
      </div>

      {/* Tabs Full Width */}
      <Tabs defaultValue="ingredients" value={tab} onValueChange={setTab}>
        <TabsList className="mb-6 flex w-full justify-center rounded-lg bg-muted p-1">
          <TabsTrigger className="flex-1" value="ingredients">
            Ingredients
          </TabsTrigger>
          <TabsTrigger className="flex-1" value="menu">
            Menu Items
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {items.map((item) => (
          <div
            key={item.uniqueId}
            className="flex flex-col justify-between rounded-xl border p-4 shadow-sm transition duration-200 hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <Checkbox
                checked={selectedItems.some((i) => i.uniqueId === item.uniqueId)}
                onCheckedChange={() => toggleSelection(item)}
              />
              <span className="text-lg font-semibold">{item.name}</span>
            </div>
            <Button variant="outline" className="mt-4" onClick={() => openPrintDialog(item)}>
              <PrinterIcon className="mr-2 h-4 w-4" /> Print
            </Button>
          </div>
        ))}
      </div>

      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => openPrintDialog()}
          disabled={selectedItems.length === 0}
          className="px-6 py-3 text-base font-medium shadow-lg"
        >
          <PrinterIcon className="mr-2 h-5 w-5" /> Print Selected
        </Button>
      </div>

      <Dialog open={printDialogOpen} onOpenChange={setPrintDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Select Quantities</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {selectedItems.map((item) => (
              <div key={item.uniqueId} className="flex items-center justify-between">
                <span>{item.name}</span>
                <Input
                  type="number"
                  min={1}
                  value={quantities[item.uniqueId] || 1}
                  onChange={(e) =>
                    setQuantities({ ...quantities, [item.uniqueId]: parseInt(e.target.value, 10) })
                  }
                  className="w-20"
                />
              </div>
            ))}
          </div>
          <DialogFooter className="pt-4">
            <Button onClick={handlePrint} className="w-full">
              Print
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
