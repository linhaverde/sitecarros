import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Car, Phone, Mail, MapPin, Star, Shield, Wrench, Users } from 'lucide-react'
import { supabase } from './lib/supabase'
import logo from './assets/logo.jpg'
import carIconGreen from './assets/car-icon-green.png'
import civic2020 from './assets/civic-2020.jpg'
import corolla2021 from './assets/corolla-2021.jpg'
import jetta2019 from './assets/jetta-2019.jpg'
import './App.css'

function App() {
  const navigate = useNavigate()
  const [vehicles, setVehicles] = useState([])
  const [loading, setLoading] = useState(true)

  // Dados estáticos como fallback
  const fallbackVehicles = [
    {
      id: 1,
      name: "Honda Civic EXL",
      year: 2020,
      price: "R$ 89.900",
      mileage: "45.000 km",
      fuel: "Flex",
      images: [civic2020]
    },
    {
      id: 2,
      name: "Toyota Corolla XEI",
      year: 2021,
      price: "R$ 95.500",
      mileage: "32.000 km",
      fuel: "Flex",
      images: [corolla2021]
    },
    {
      id: 3,
      name: "Volkswagen Jetta Comfortline",
      year: 2019,
      price: "R$ 78.900",
      mileage: "58.000 km",
      fuel: "Flex",
      images: [jetta2019]
    }
  ]

  useEffect(() => {
    fetchVehicles()
  }, [])

  const fetchVehicles = async () => {
    try {
      const { data, error } = await supabase
        .from('vehicles')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Erro ao carregar veículos:', error)
        // Usar dados estáticos como fallback
        setVehicles(fallbackVehicles)
      } else {
        // Se não há veículos no banco, usar dados estáticos
        if (!data || data.length === 0) {
          setVehicles(fallbackVehicles)
        } else {
          setVehicles(data)
        }
      }
    } catch (err) {
      console.error('Erro inesperado:', err)
      // Usar dados estáticos como fallback
      setVehicles(fallbackVehicles)
    } finally {
      setLoading(false)
    }
  }

  const handleVehicleClick = (vehicleId) => {
    navigate(`/vehicle/${vehicleId}`)
  }

  const testimonials = [
    {
      name: "Maria Silva",
      rating: 5,
      comment: "Excelente atendimento e carros de qualidade. Recomendo!"
    },
    {
      name: "João Santos",
      rating: 5,
      comment: "Comprei meu carro aqui e foi a melhor experiência. Equipe muito profissional."
    },
    {
      name: "Ana Costa",
      rating: 5,
      comment: "Preços justos e transparência total. Voltarei sempre!"
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img src={logo} alt="Linha Verde Automóveis" className="h-16 w-auto" />
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#home" className="text-gray-700 hover:text-green-600 transition-colors">Início</a>
              <a href="#vehicles" className="text-gray-700 hover:text-green-600 transition-colors">Veículos</a>
              <a href="#about" className="text-gray-700 hover:text-green-600 transition-colors">Sobre</a>
              <a href="#contact" className="text-gray-700 hover:text-green-600 transition-colors">Contato</a>
              {/* REMOVIDO: <a href="/login" className="text-gray-700 hover:text-green-600 transition-colors">Admin</a> */}
            </nav>
            <Button className="bg-green-600 hover:bg-green-700 text-white">
              <Phone className="w-4 h-4 mr-2" />
              Contato
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section id="home" className="gradient-green-black text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="fade-in">
            <img src={carIconGreen} alt="Carro Verde" className="w-20 h-20 mx-auto mb-6 opacity-80" />
            <h2 className="text-5xl font-bold mb-6">Seu Próximo Carro Está Aqui</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Na Linha Verde Automóveis, oferecemos os melhores veículos com qualidade garantida e atendimento excepcional.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100 hover-scale">
                <Car className="w-5 h-5 mr-2" />
                Ver Estoque
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-green-600 hover-scale">
                <Phone className="w-5 h-5 mr-2" />
                Falar Conosco
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Vehicles Section */}
      <section id="vehicles" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold mb-4 linha-verde-black-text">Nossos Veículos</h3>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Confira nosso estoque de veículos seminovos com qualidade garantida e os melhores preços.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {vehicles.map((vehicle, index) => (
              <Card key={vehicle.id || index} className="hover-scale cursor-pointer border-2 hover:border-green-500 transition-all duration-300" onClick={() => handleVehicleClick(vehicle.id)}>
                <div className="relative">
                  <img
                    src={vehicle.images && vehicle.images[0] ? vehicle.images[0] : vehicle.image}
                    alt={vehicle.name}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <Badge className="absolute top-4 right-4 bg-green-600 text-white">{vehicle.year}</Badge>
                </div>
                <CardHeader>
                  <CardTitle className="text-xl">{vehicle.name}</CardTitle>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold linha-verde-green-text">{vehicle.price}</span>
                    <span className="text-gray-600">{vehicle.mileage}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Ano: {vehicle.year}</span>
                    <span>Combustível: {vehicle.fuel}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-4xl font-bold mb-6 linha-verde-black-text">Sobre a Linha Verde</h3>
              <p className="text-lg text-gray-700 mb-6">
                Com anos de experiência no mercado automotivo, a Linha Verde Automóveis se destaca pela qualidade dos veículos oferecidos e pelo atendimento personalizado a cada cliente.
              </p>
              <p className="text-lg text-gray-700 mb-8">
                Nossa missão é conectar você ao carro dos seus sonhos, oferecendo transparência, confiança e as melhores condições do mercado.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold linha-verde-green-text">500+</div>
                  <div className="text-gray-600">Carros Vendidos</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold linha-verde-green-text">98%</div>
                  <div className="text-gray-600">Clientes Satisfeitos</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <img src={logo} alt="Linha Verde Automóveis" className="w-full rounded-lg shadow-lg" />
              <div className="absolute inset-0 bg-green-600 bg-opacity-20 rounded-lg"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold mb-4 linha-verde-black-text">O Que Nossos Clientes Dizem</h3>
            <p className="text-xl text-gray-600">Depoimentos reais de quem confia na Linha Verde</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="hover-scale">
                <CardContent className="pt-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-4">"{testimonial.comment}"</p>
                  <div className="font-semibold linha-verde-green-text">{testimonial.name}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 gradient-green-black text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold mb-4">Entre em Contato</h3>
            <p className="text-xl opacity-90">Estamos prontos para ajudá-lo a encontrar o carro ideal</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-white bg-opacity-20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-semibold mb-2">Telefone</h4>
              <p className="opacity-90">(11) 9999-9999</p>
            </div>
            <div className="text-center">
              <div className="bg-white bg-opacity-20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-semibold mb-2">Email</h4>
              <p className="opacity-90">contato@linhaverde.com.br</p>
            </div>
            <div className="text-center">
              <div className="bg-white bg-opacity-20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-semibold mb-2">Endereço</h4>
              <p className="opacity-90">Rua das Flores, 123<br />São Paulo - SP</p>
            </div>
          </div>
          <div className="text-center mt-12">
            <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100 hover-scale">
              <Phone className="w-5 h-5 mr-2" />
              Fale Conosco Agora
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-12">
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
              <h5 className="text-lg font-semibold mb-4">Serviços</h5>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-green-400 transition-colors">Venda de Veículos</a></li>
                <li><a href="#" className="hover:text-green-400 transition-colors">Manutenção</a></li>
                <li><a href="#" className="hover:text-green-400 transition-colors">Garantia</a></li>
                <li><a href="#" className="hover:text-green-400 transition-colors">Financiamento</a></li>
              </ul>
            </div>
            <div>
              <h5 className="text-lg font-semibold mb-4">Empresa</h5>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className className="hover:text-green-400 transition-colors">Sobre Nós</a></li>
                <li><a href="#" className="hover:text-green-400 transition-colors">Nossa Equipe</a></li>
                <li><a href="#" className="hover:text-green-400 transition-colors">Carreiras</a></li>
                <li><a href="#" className="hover:text-green-400 transition-colors">Blog</a></li>
                {/* ADICIONADO: Link para Área Administrativa no rodapé */}
                <li><a href="/login" className="hover:text-green-400 transition-colors">Área Administrativa</a></li>
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

export default App