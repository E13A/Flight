"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/toast"
import { Wallet } from "lucide-react"

export function WalletConnect() {
    const [address, setAddress] = React.useState(null)
    const { addToast } = useToast()

    const connectWallet = async () => {
        // Mock connection
        try {
            // In real app: window.ethereum.request({ method: 'eth_requestAccounts' })
            setTimeout(() => {
                const mockAddress = "0x71C...9A21"
                setAddress(mockAddress)
                addToast("Wallet connected successfully!", "success")
            }, 800)
        } catch (error) {
            addToast("Failed to connect wallet", "error")
        }
    }

    return (
        <Button
            variant={address ? "outline" : "default"}
            onClick={connectWallet}
            className="gap-2"
        >
            <Wallet className="h-4 w-4" />
            {address ? address : "Connect Wallet"}
        </Button>
    )
}
