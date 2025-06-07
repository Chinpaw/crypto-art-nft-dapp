"use client"

import { useState, useEffect } from "react"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Wallet, Star, Shield, Zap, Users, Trophy, Sparkles,
  ExternalLink, Gem, Clock, Layers, Award,
} from "lucide-react"

import { ConnectButton } from "@rainbow-me/rainbowkit"
import { useReadContract, useWriteContract } from "wagmi"
import { parseEther } from 'viem'
import { contractAddress, contractABI } from "./lib/contract"

export default function Component() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [nftImage, setNftImage] = useState<string | null>(null);
  const [nftName, setNftName] = useState<string | null>(null);

  // --- Hook untuk Interaksi Smart Contract ---
  const { data: totalSupply, isLoading: isLoadingSupply } = useReadContract({
    address: contractAddress,
    abi: contractABI,
    functionName: 'totalSupply',
  });
  const { writeContract, isPending, isSuccess, error } = useWriteContract();
  const { data: tokenURI } = useReadContract({
    address: contractAddress,
    abi: contractABI,
    functionName: 'tokenURI',
    args: [BigInt(0)],
    query: { enabled: totalSupply ? BigInt(totalSupply.toString()) > 0 : false }
  });

  async function handleMint() {
    writeContract({
      address: contractAddress,
      abi: contractABI,
      functionName: 'safeMint',
      value: parseEther('0.001')
    });
  }
  
  useEffect(() => {
    if (tokenURI && typeof tokenURI === 'string') {
      const metadataUrl = tokenURI.replace("ipfs://", "https://gateway.pinata.cloud/ipfs/");
      fetch(metadataUrl)
        .then(res => res.json())
        .then(metadata => {
          setNftName(metadata.name);
          if (metadata.image) {
            const imageUrl = metadata.image.replace("ipfs://", "https://gateway.pinata.cloud/ipfs/");
            setNftImage(imageUrl);
          }
        })
        .catch(console.error);
    }
  }, [tokenURI]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  const features = [ { icon: Shield, title: "Exclusive Access", description: "Get access to private Discord channels and exclusive events", }, { icon: Zap, title: "Staking Rewards", description: "Earn passive income by staking your NFT for daily rewards", }, { icon: Users, title: "Community Perks", description: "Join a vibrant community of collectors and creators", }, { icon: Trophy, title: "Rare Traits", description: "Each NFT has unique traits with varying rarity levels", }, ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white overflow-hidden">
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 px-6 py-4 ${ isScrolled ? "bg-black/20 backdrop-blur-lg border-b border-white/10" : "bg-transparent" }`}>
        <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center"> <Sparkles className="w-5 h-5" /> </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent"> CryptoArt </span>
            </div>
            <ConnectButton />
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-24 pb-16 px-6">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-3xl blur-xl opacity-75 group-hover:opacity-100 transition-opacity animate-pulse" />
              <div className="relative bg-black/20 backdrop-blur-sm rounded-3xl p-8 border border-white/10 group-hover:scale-105 transition-transform duration-500">
                <Image 
                  src={nftImage || "/placeholder.svg?height=400&width=400"} 
                  alt={nftName || "Cosmic Dragon NFT"} 
                  width={400} height={400} 
                  className="w-full h-auto rounded-2xl shadow-2xl group-hover:rotate-2 transition-transform duration-500" 
                  priority
                />
                <div className="absolute top-4 right-4">
                  <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold animate-bounce"> #001 </Badge>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="space-y-4">
                <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">Limited Edition</Badge>
                <h1 className="text-5xl lg:text-7xl font-bold bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent animate-pulse"> Cosmic Dragon </h1>
                <p className="text-xl text-gray-300 leading-relaxed"> A legendary creature from the digital realm, this Cosmic Dragon represents power, wisdom, and the infinite possibilities of the metaverse. Own a piece of digital history. </p>
              </div>
              <div className="flex items-center space-x-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-400">0.001 ETH</div>
                  <div className="text-sm text-gray-400">Mint Price</div>
                </div>
                <div className="text-center">
                   <div className="text-3xl font-bold text-blue-400">
                      {isLoadingSupply ? '...' : totalSupply?.toString() ?? '0'} / 1000
                   </div>
                   <div className="text-sm text-gray-400">Minted</div>
                </div>
              </div>
              <Button size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-4 px-8 rounded-xl border-0 group transform hover:scale-105 transition-all duration-300 shadow-2xl"
                onClick={handleMint}
                disabled={isPending}
              >
                <Sparkles className="w-5 h-5 mr-2 group-hover:animate-spin" />
                {isPending ? "Confirming..." : "Claim Your NFT"}
                <ExternalLink className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <div className="mt-4 text-center h-6">
                {isPending && <p className="text-blue-300 animate-pulse">Please check your wallet...</p>}
                {isSuccess && <p className="text-green-400">Mint Successful!</p>}
                {error && <p className="text-red-400">Error: {error.message}</p>}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About the NFT Section */}
      <section className="py-16 px-6 relative">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-white to-purple-300 bg-clip-text text-transparent">
              About The NFT
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Discover the story and unique properties of the Cosmic Dragon NFT
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-black/20 backdrop-blur-sm rounded-3xl p-8 border border-white/10 hover:bg-black/30 transition-all duration-500 group">
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-500">
                    <Gem className="w-6 h-6 text-white" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-white">Unique Traits</h3>
                    <p className="text-gray-300">
                      Each Cosmic Dragon NFT features a unique combination of traits, including scales, wings, eyes, and
                      special powers. With over 200 possible trait combinations, your NFT is truly one-of-a-kind.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-500">
                    <Layers className="w-6 h-6 text-white" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-white">Blockchain Technology</h3>
                    <p className="text-gray-300">
                      Built on the Ethereum blockchain using ERC-721 standard, ensuring verifiable ownership and
                      seamless trading across all major NFT marketplaces.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-black/20 backdrop-blur-sm rounded-3xl p-8 border border-white/10 hover:bg-black/30 transition-all duration-500 group">
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-500">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-white">Limited Release</h3>
                    <p className="text-gray-300">
                      With only 1,000 Cosmic Dragons ever to be minted, these NFTs represent a scarce digital asset that
                      will grow in value over time as the collection gains recognition.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-500">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-white">Utility & Access</h3>
                    <p className="text-gray-300">
                      Your Cosmic Dragon is more than just art—it's your key to exclusive events, merchandise drops, and
                      future airdrops from the CryptoArt ecosystem.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Creator Section */}
      <section className="py-16 px-6 relative">
        <div className="container mx-auto">
          <Card className="bg-black/20 backdrop-blur-sm border-white/10 hover:bg-black/30 transition-all duration-500 group">
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                    Meet the Creator
                  </h2>
                  <p className="text-gray-300 leading-relaxed">
                    Created by renowned digital artist Alex Chen, who has been pioneering the intersection of
                    traditional art and blockchain technology for over 5 years. Each piece is meticulously crafted with
                    attention to detail and storytelling.
                  </p>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Star className="w-5 h-5 text-yellow-400 fill-current" />
                      <span className="text-sm">4.9/5 Rating</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Trophy className="w-5 h-5 text-purple-400" />
                      <span className="text-sm">50+ Collections</span>
                    </div>
                  </div>
                </div>
                <div className="relative group-hover:scale-105 transition-transform duration-500">
                  <div className="w-48 h-48 mx-auto relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full blur-lg opacity-50" />
                    <Image
                      src="/nft.jpg"
                      alt="Creator Avatar"
                      width={200}
                      height={200}
                      className="relative w-full h-full rounded-full border-4 border-white/20 object-cover"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Holder Benefits
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Unlock exclusive perks and benefits when you become a holder of our NFT collection
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="bg-black/20 backdrop-blur-sm border-white/10 hover:bg-black/30 hover:border-purple-500/30 transition-all duration-500 group hover:scale-105"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-6 text-center space-y-4">
                  <div className="w-16 h-16 mx-auto bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-500">
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white group-hover:text-purple-300 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 group-hover:text-gray-300 transition-colors">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-white/10">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                CryptoArt
              </span>
            </div>
            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <a href="#" className="hover:text-white transition-colors">
                Terms
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Privacy
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Discord
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Twitter
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}