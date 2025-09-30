// apps/mobile/src/utils/deepLinks.ts
import * as Linking from 'expo-linking'

type DeepLinkListener = (url: string) => void

class DeepLinkService {
  private listeners: DeepLinkListener[] = []
  private initialized = false

  async initialize(): Promise<void> {
    if (this.initialized) return

    try {
      // Escuchar URLs cuando la app está abierta
      Linking.addEventListener('url', this.handleIncomingURL)
      
      // Verificar si la app se abrió con una URL
      const initialUrl = await Linking.getInitialURL()
      if (initialUrl) {
        console.log('📱 App abierta con URL inicial:', initialUrl)
        this.handleIncomingURL({ url: initialUrl })
      }

      this.initialized = true
      console.log('✅ Deep Links inicializados')
    } catch (error) {
      console.error('❌ Error inicializando Deep Links:', error)
      throw error
    }
  }

  private handleIncomingURL = ({ url }: { url: string }) => {
    console.log('🔗 Deep link recibido:', url)
    
    // Notificar a todos los listeners
    this.listeners.forEach(listener => {
      try {
        listener(url)
      } catch (error) {
        console.error('❌ Error en listener de deep link:', error)
      }
    })
  }

  addListener(listener: DeepLinkListener): () => void {
    this.listeners.push(listener)
    
    // Retornar función para remover el listener
    return () => {
      const index = this.listeners.indexOf(listener)
      if (index > -1) {
        this.listeners.splice(index, 1)
      }
    }
  }

  isInitialized(): boolean {
    return this.initialized
  }

  async openURL(url: string): Promise<boolean> {
    try {
      const canOpen = await Linking.canOpenURL(url)
      if (canOpen) {
        await Linking.openURL(url)
        return true
      }
      return false
    } catch (error) {
      console.error('❌ Error abriendo URL:', error)
      return false
    }
  }

  createURL(path: string = '', queryParams: Record<string, string> = {}): string {
    return Linking.createURL(path, queryParams)
  }

  parseURL(url: string): Linking.URLParse {
    return Linking.parse(url)
  }

  cleanup() {
    if (this.initialized) {
      Linking.removeEventListener('url', this.handleIncomingURL)
      this.listeners = []
      this.initialized = false
      console.log('🧹 Deep Links limpiados')
    }
  }
}

// Instancia singleton
export const deepLinkService = new DeepLinkService()