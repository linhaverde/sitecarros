import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { ArrowLeft, Phone, Mail, Car, Fuel, Calendar, Gauge, Cog, Shield, CheckCircle } from 'lucide-react'
import { supabase } from '../lib/supabase'
import logo from '../assets/logo.jpg'
import civic2020 from '../assets/civic-2020.jpg'
import corolla2021 from '../assets/corolla-2021.jpg'
import jetta2019 from '../assets/jetta-2019.jpg'
import { MapPin } from 'lucide-react'


function VehicleDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [vehicle, setVehicle] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Dados estáticos como fallback
  const fallbackVehiclesData = {
    1: {
      id: 1,
      name: "Honda Civic EXL",
      year: 2020,
      price: "R$ 89.900",
      mileage: "45.000 km",
      fuel: "Flex",
      transmission: "CVT Automático",
      engine: "2.0 16V i-VTEC",
      color: "Branco Pérola",
      doors: "4 portas",
      images: [civic2020, civic2020, civic2020, civic2020],
      description: "Honda Civic EXL 2020 em excelente estado de conservação. Veículo revisado, com todos os manuais e chaves. Ideal para quem busca conforto, economia e tecnologia.",
      features: [
        "Ar condicionado digital",
        "Central multimídia com Android Auto/Apple CarPlay",
        "Câmera de ré",
        "Sensor de estacionamento",
        "Bancos em couro",
        "Rodas de liga leve 17\"",
        "Faróis em LED",
        "Controle de cruzeiro",
        "Piloto automático",
        "Sistema de som premium"
      ],
      specifications: {
        "Motor": "2.0 16V i-VTEC Flex",
        "Potência": "155 cv (etanol) / 150 cv (gasolina)",
        "Torque": "19,4 kgfm (etanol) / 19,0 kgfm (gasolina)",
        "Transmissão": "CVT Automático",
        "Tração": "Dianteira",
        "Combustível": "Flex (Etanol/Gasolina)",
        "Consumo cidade": "9,2 km/l (etanol) / 13,1 km/l (gasolina)",
        "Consumo estrada": "10,8 km/l (etanol) / 15,4 km/l (gasolina)",
        "Tanque": "50 litros",
        "Porta-malas": "519 litros"
      }
    },
    2: {
      id: 2,
      name: "Toyota Corolla XEI",
      year: 2021,
      price: "R$ 95.500",
      mileage: "32.000 km",
      fuel: "Flex",
      transmission: "CVT Automático",
      engine: "2.0 16V Dual VVT-i",
      color: "Prata Metálico",
      doors: "4 portas",
      images: [corolla2021, corolla2021, corolla2021, corolla2021],
      description: "Toyota Corolla XEI 2021 com baixa quilometragem. Veículo impecável, único dono, sempre revisado na concessionária. Perfeito para quem valoriza qualidade e durabilidade.",
      features: [
        "Ar condicionado automático",
        "Central multimídia Toyota Play",
        "Câmera de ré com linhas dinâmicas",
        "Sensores de estacionamento dianteiro e traseiro",
        "Bancos em tecido premium",
        "Rodas de liga leve 16\"",
        "Faróis automáticos",
        "Controle de cruzeiro adaptativo",
        "Sistema Toyota Safety Sense 2.0",
        "Carregador wireless"
      ],
      specifications: {
        "Motor": "2.0 16V Dual VVT-i Flex",
        "Potência": "177 cv (etanol) / 169 cv (gasolina)",
        "Torque": "21,4 kgfm (etanol) / 20,6 kgfm (gasolina)",
        "Transmissão": "CVT Automático",
        "Tração": "Dianteira",
        "Combustível": "Flex (Etanol/Gasolina)",
        "Consumo cidade": "9,8 km/l (etanol) / 14,0 km/l (gasolina)",
        "Consumo estrada": "11,5 km/l (etanol) / 16,4 km/l (gasolina)",
        "Tanque": "50 litros",
        "Porta-malas": "470 litros"
      }
    },
    3: {
      id: 3,
      name: "Volkswagen Jetta Comfortline",
      year: 2019,
      price: "R$ 78.900",
      mileage: "58.000 km",
      fuel: "Flex",
      transmission: "Tiptronic Automático",
      engine: "1.4 TSI Turbo",
      color: "Preto Ninja",
      doors: "4 portas",
      images: [jetta2019, jetta2019, jetta2019, jetta2019],
      description: "Volkswagen Jetta Comfortline 2019 com motor turbo. Sedan esportivo e elegante, com excelente custo-benefício. Manutenção em dia e documentação ok.",
      features: [
        "Ar condicionado Climatronic",
        "Central multimídia Composition Media",
        "Câmera de ré",
        "Sensor de estacionamento traseiro",
        "Bancos em tecido",
        "Rodas de liga leve 16\"",
        "Faróis com regulagem elétrica",
        "Controle de cruzeiro",
        "Computador de bordo",
        "Volante multifuncional"
      ],
      specifications: {
        "Motor": "1.4 TSI Turbo Flex",
        "Potência": "150 cv (etanol) / 140 cv (gasolina)",
        "Torque": "25,5 kgfm (etanol) / 24,5 kgfm (gasolina)",
        "Transmissão": "Tiptronic 6 marchas",
        "Tração": "Dianteira",
        "Combustível": "Flex (Etanol/Gasolina)",
        "Consumo cidade": "8,9 km/l (etanol) / 12,7 km/l (gasolina)",
        "Consumo estrada": "11,2 km/l (etanol) / 16,0 km/l (gasolina)",
        "Tanque": "50 litros",
        "Porta-malas": "510 litros"
      }
    }
  }

  useEffect(() => {
    fetchVehicle()
  }, [id])

  const fetchVehicle = async () => {
    try {
      const { data, error } = await supabase
        .from('vehicles')
        .select('*')
        .eq('id', id)
        .single()

      if (error || !data) {
        // Usar dados estáticos como fallback
        const fallbackVehicle = fallbackVehiclesData[id]
        if (fallbackVehicle) {
          setVehicle(fallbackVehicle)
        } else {
          setError('Veículo não encontrado')
        }
      } else {
        setVehicle(data)
      }
    } catch (err) {
      // Usar dados estáticos como fallback
      const fallbackVehicle = fallbackVehiclesData[id]
      if (fallbackVehicle) {
        setVehicle(fallbackVehicle)
      } else {
        setError('Erro ao carregar veículo')
      }
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Car className="w-12 h-12 animate-spin mx-auto mb-4 text-green-600" />
          <p>Carregando...</p>
        </div>
      </div>
    )
  }

  if (error || !vehicle) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Veículo não encontrado</h2>
          <Button onClick={() => navigate('/')}>Voltar ao início</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img src={logo} alt="Linha Verde Automóveis" className="h-16 w-auto" />
            </div>
            <nav className="hidden md:flex space-x-6">
              <a href="/" className="text-gray-700 hover:text-green-600 transition-colors">Início</a>
              <a href="/#vehicles" className="text-gray-700 hover:text-green-600 transition-colors">Veículos</a>
              <a href="/#about" className="text-gray-700 hover:text-green-600 transition-colors">Sobre</a>
              <a href="/#contact" className="text-gray-700 hover:text-green-600 transition-colors">Contato</a>
            </nav>
            <Button className="bg-green-600 hover:bg-green-700 text-white">
              <Phone className="w-4 h-4 mr-2" />
              Contato
            </Button>
          </div>
        </div>
      </header>

      {/* Vehicle Detail Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button 
          variant="outline" 
          className="mb-6"
          onClick={() => navigate('/')}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar ao estoque
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div>
            <div className="mb-4">
              <img 
                src={vehicle.images[currentImageIndex]} 
                alt={vehicle.name}
                className="w-full h-96 object-cover rounded-lg shadow-lg"
              />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {vehicle.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`${vehicle.name} ${index + 1}`}
                  className={`w-full h-20 object-cover rounded cursor-pointer transition-all ${
                    currentImageIndex === index ? 'ring-2 ring-green-500' : 'opacity-70 hover:opacity-100'
                  }`}
                  onClick={() => setCurrentImageIndex(index)}
                />
              ))}
            </div>
          </div>

          {/* Vehicle Info */}
          <div>
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <h1 className="text-3xl font-bold">{vehicle.name}</h1>
                <Badge className="bg-green-600 text-white">{vehicle.year}</Badge>
              </div>
              <p className="text-4xl font-bold linha-verde-green-text mb-4">{vehicle.price}</p>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-gray-500" />
                  <span>Ano: {vehicle.year}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Gauge className="w-5 h-5 text-gray-500" />
                  <span>{vehicle.mileage}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Fuel className="w-5 h-5 text-gray-500" />
                  <span>{vehicle.fuel}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Cog className="w-5 h-5 text-gray-500" />
                  <span>{vehicle.transmission}</span>
                </div>
              </div>

              <p className="text-gray-700 mb-6">{vehicle.description}</p>

              <div className="flex gap-4">
                <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white flex-1">
                  <Phone className="w-5 h-5 mr-2" />
                  Entrar em Contato
                </Button>
                <Button size="lg" variant="outline" className="flex-1">
                  <Mail className="w-5 h-5 mr-2" />
                  Solicitar Proposta
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Specifications and Features */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
          {/* Features */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                Opcionais e Equipamentos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-2">
                {vehicle.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Specifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Car className="w-5 h-5 text-green-600" />
                Especificações Técnicas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(vehicle.specifications).map(([key, value]) => (
                  <div key={key} className="flex justify-between border-b border-gray-100 pb-2">
                    <span className="font-medium text-gray-700">{key}:</span>
                    <span className="text-gray-600">{value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contact Section */}
        <Card className="mt-12 bg-green-50">
          <CardContent className="p-8 text-center">
            <Shield className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-4">Interessado neste veículo?</h3>
            <p className="text-gray-700 mb-6">
              Entre em contato conosco para mais informações, agendamento de test drive ou negociação.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white">
                <Phone className="w-5 h-5 mr-2" />
                (11) 9999-9999
              </Button>
              <Button size="lg" variant="outline">
                <Mail className="w-5 h-5 mr-2" />
                contato@linhaverde.com.br
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <footer className="bg-black text-white py-12 mt-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <img src={logo} alt="Linha Verde" className="h-8 w-auto" />
                <span className="text-xl font-bold">Linha Verde</span>
              </div>
              <p className="text-gray-400">Sua concessionária de confiança para encontrar o carro perfeito.</p>
            </div>
            <div>
              <h5 className="text-lg font-semibold mb-4">Veículos</h5>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-green-400 transition-colors">Seminovos</a></li>
                <li><a href="#" className="hover:text-green-400 transition-colors">Financiamento</a></li>
                <li><a href="#" className="hover:text-green-400 transition-colors">Garantia</a></li>
                <li><a href="#" className="hover:text-green-400 transition-colors">Avaliação</a></li>
              </ul>
            </div>
            <div>
              <h5 className="text-lg font-semibold mb-4">Empresa</h5>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-green-400 transition-colors">Sobre Nós</a></li>
                <li><a href="#" className="hover:text-green-400 transition-colors">Nossa Equipe</a></li>
                <li><a href="#" className="hover:text-green-400 transition-colors">Carreiras</a></li>
                <li><a href="#" className="hover:text-green-400 transition-colors">Blog</a></li>
              </ul>
            </div>
            <div>
              <h5 className="text-lg font-semibold mb-4">Contato</h5>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-center"><Phone className="w-4 h-4 mr-2" /> (11) 9999-9999</li>
                <li className="flex items-center"><Mail className="w-4 h-4 mr-2" /> contato@linhaverde.com.br</li>
                <li className="flex items-center"><MapPin className="w-4 h-4 mr-2" /> São Paulo - SP</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Linha Verde Automóveis. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default VehicleDetail

