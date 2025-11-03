import { createContext, useContext, useState, useEffect } from 'react'
import sampleData from '../../sample.json'

const OffersContext = createContext()

export function useOffers() {
  const context = useContext(OffersContext)
  if (!context) {
    throw new Error('useOffers must be used within OffersProvider')
  }
  return context
}

export function OffersProvider({ children }) {
  const [offers, setOffers] = useState(() => {
    // Initialize with sample offer
    const sampleOffer = sampleData.props.pageProps.offer
    const sampleMessages = sampleData.props.pageProps.messages
    return [
      {
        ...sampleOffer,
        messages: sampleMessages
      }
    ]
  })

  const getOfferById = (id) => {
    return offers.find(offer => 
      offer.public_uuid === id || offer.uuid === id || offer.id.toString() === id
    )
  }

  const createOffer = (offerData) => {
    const newOffer = {
      ...offerData,
      id: Date.now(),
      uuid: crypto.randomUUID(),
      public_uuid: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      state: 'open',
      offer_signed_at: null,
      messages: []
    }
    setOffers(prev => [...prev, newOffer])
    return newOffer
  }

  const updateOffer = (id, updates) => {
    setOffers(prev => prev.map(offer => 
      offer.id === id ? { ...offer, ...updates } : offer
    ))
  }

  const deleteOffer = (id) => {
    setOffers(prev => prev.filter(offer => offer.id !== id))
  }

  return (
    <OffersContext.Provider value={{ 
      offers, 
      getOfferById, 
      createOffer, 
      updateOffer, 
      deleteOffer 
    }}>
      {children}
    </OffersContext.Provider>
  )
}

