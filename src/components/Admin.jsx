import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { Alert, AlertDescription } from '@/components/ui/alert.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog.jsx'
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table.jsx'
import { 
  Car, 
  Plus, 
  Edit, 
  Trash2, 
  LogOut, 
  Upload, 
  X,
  Save,
  Eye
} from 'lucide-react'
import logo from '../assets/logo.jpg'

function Admin() {
  const [user, setUser] = useState(null)
  const [vehicles, setVehicles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingVehicle, setEditingVehicle] = useState(null)
  const [uploadingImages, setUploadingImages] = useState(false)
  const navigate = useNavigate()

  // Estado do formulário
  const [formData, setFormData] = useState({
    name: '',
    year: '',
    price: '',
    mileage: '',
    fuel: '',
    transmission: '',
    engine: '',
    color: '',
    doors: '',
    description: '',
    features: '',
    specifications: ''
  })
  const [selectedImages, setSelectedImages] = useState([])
  const [imageUrls, setImageUrls] = useState([])

  useEffect(() => {
    checkUser()
    fetchVehicles()
  }, [])

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      navigate('/login')
    } else {
      setUser(user)
    }
  }

  const fetchVehicles = async () => {
    try {
      const { data, error } = await supabase
        .from('vehicles')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        setError('Erro ao carregar veículos: ' + error.message)
      } else {
        setVehicles(data || [])
      }
    } catch (err) {
      setError('Erro inesperado ao carregar veículos')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/login')
  }

  const resetForm = () => {
    setFormData({
      name: '',
      year: '',
      price: '',
      mileage: '',
      fuel: '',
      transmission: '',
      engine: '',
      color: '',
      doors: '',
      description: '',
      features: '',
      specifications: ''
    })
    setSelectedImages([])
    setImageUrls([])
    setEditingVehicle(null)
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files)
    setSelectedImages(files)
    
    // Criar URLs de preview
    const urls = files.map(file => URL.createObjectURL(file))
    setImageUrls(urls)
  }

  const uploadImages = async (vehicleId) => {
    if (selectedImages.length === 0) return []

    setUploadingImages(true)
    const uploadedUrls = []

    try {
      for (let i = 0; i < selectedImages.length; i++) {
        const file = selectedImages[i]
        const fileExt = file.name.split('.').pop()
        const fileName = `${vehicleId}_${i + 1}.${fileExt}`
        const filePath = `vehicles/${fileName}`

        const { data, error } = await supabase.storage
          .from('vehicle-images')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: true
          })

        if (error) {
          throw error
        }

        // Obter URL pública
        const { data: { publicUrl } } = supabase.storage
          .from('vehicle-images')
          .getPublicUrl(filePath)

        uploadedUrls.push(publicUrl)
      }
    } catch (error) {
      throw new Error('Erro ao fazer upload das imagens: ' + error.message)
    } finally {
      setUploadingImages(false)
    }

    return uploadedUrls
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      // Preparar dados do veículo
      const vehicleData = {
        ...formData,
        year: parseInt(formData.year),
        features: formData.features.split('\n').filter(f => f.trim()),
        specifications: JSON.parse(formData.specifications || '{}')
      }

      let vehicleId
      let imageUrls = []

      if (editingVehicle) {
        // Atualizar veículo existente
        const { data, error } = await supabase
          .from('vehicles')
          .update(vehicleData)
          .eq('id', editingVehicle.id)
          .select()

        if (error) throw error
        vehicleId = editingVehicle.id
      } else {
        // Criar novo veículo
        const { data, error } = await supabase
          .from('vehicles')
          .insert([vehicleData])
          .select()

        if (error) throw error
        vehicleId = data[0].id
      }

      // Upload de imagens se houver
      if (selectedImages.length > 0) {
        imageUrls = await uploadImages(vehicleId)
        
        // Atualizar veículo com URLs das imagens
        const { error: updateError } = await supabase
          .from('vehicles')
          .update({ images: imageUrls })
          .eq('id', vehicleId)

        if (updateError) throw updateError
      }

      setSuccess(editingVehicle ? 'Veículo atualizado com sucesso!' : 'Veículo criado com sucesso!')
      setIsDialogOpen(false)
      resetForm()
      fetchVehicles()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (vehicle) => {
    setEditingVehicle(vehicle)
    setFormData({
      name: vehicle.name || '',
      year: vehicle.year?.toString() || '',
      price: vehicle.price || '',
      mileage: vehicle.mileage || '',
      fuel: vehicle.fuel || '',
      transmission: vehicle.transmission || '',
      engine: vehicle.engine || '',
      color: vehicle.color || '',
      doors: vehicle.doors || '',
      description: vehicle.description || '',
      features: Array.isArray(vehicle.features) ? vehicle.features.join('\n') : '',
      specifications: typeof vehicle.specifications === 'object' ? JSON.stringify(vehicle.specifications, null, 2) : ''
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (vehicleId) => {
    if (!confirm('Tem certeza que deseja excluir este veículo?')) return

    try {
      const { error } = await supabase
        .from('vehicles')
        .delete()
        .eq('id', vehicleId)

      if (error) throw error

      setSuccess('Veículo excluído com sucesso!')
      fetchVehicles()
    } catch (err) {
      setError('Erro ao excluir veículo: ' + err.message)
    }
  }

  if (loading && vehicles.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Car className="w-12 h-12 animate-spin mx-auto mb-4 text-green-600" />
          <p>Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <img src={logo} alt="Linha Verde" className="h-10 w-auto" />
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Painel Administrativo</h1>
                <p className="text-sm text-gray-500">Gerenciar Estoque de Veículos</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Olá, {user?.email}
              </span>
              <Button variant="outline" onClick={() => navigate('/')}>
                <Eye className="w-4 h-4 mr-2" />
                Ver Site
              </Button>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Alerts */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {success && (
          <Alert className="mb-6">
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        {/* Header Section */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Veículos em Estoque</h2>
            <p className="text-gray-600">Gerencie o catálogo de veículos da sua loja</p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                className="bg-green-600 hover:bg-green-700"
                onClick={() => {
                  resetForm()
                  setIsDialogOpen(true)
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Veículo
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingVehicle ? 'Editar Veículo' : 'Adicionar Novo Veículo'}
                </DialogTitle>
                <DialogDescription>
                  Preencha as informações do veículo e faça upload das fotos
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Informações Básicas */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Nome do Modelo *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Ex: Honda Civic EXL"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="year">Ano *</Label>
                    <Input
                      id="year"
                      type="number"
                      value={formData.year}
                      onChange={(e) => handleInputChange('year', e.target.value)}
                      placeholder="Ex: 2020"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="price">Preço *</Label>
                    <Input
                      id="price"
                      value={formData.price}
                      onChange={(e) => handleInputChange('price', e.target.value)}
                      placeholder="Ex: R$ 89.900"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="mileage">Quilometragem *</Label>
                    <Input
                      id="mileage"
                      value={formData.mileage}
                      onChange={(e) => handleInputChange('mileage', e.target.value)}
                      placeholder="Ex: 45.000 km"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="fuel">Combustível</Label>
                    <Input
                      id="fuel"
                      value={formData.fuel}
                      onChange={(e) => handleInputChange('fuel', e.target.value)}
                      placeholder="Ex: Flex"
                    />
                  </div>
                  <div>
                    <Label htmlFor="transmission">Transmissão</Label>
                    <Input
                      id="transmission"
                      value={formData.transmission}
                      onChange={(e) => handleInputChange('transmission', e.target.value)}
                      placeholder="Ex: CVT Automático"
                    />
                  </div>
                  <div>
                    <Label htmlFor="engine">Motor</Label>
                    <Input
                      id="engine"
                      value={formData.engine}
                      onChange={(e) => handleInputChange('engine', e.target.value)}
                      placeholder="Ex: 2.0 16V i-VTEC"
                    />
                  </div>
                  <div>
                    <Label htmlFor="color">Cor</Label>
                    <Input
                      id="color"
                      value={formData.color}
                      onChange={(e) => handleInputChange('color', e.target.value)}
                      placeholder="Ex: Branco Pérola"
                    />
                  </div>
                  <div>
                    <Label htmlFor="doors">Portas</Label>
                    <Input
                      id="doors"
                      value={formData.doors}
                      onChange={(e) => handleInputChange('doors', e.target.value)}
                      placeholder="Ex: 4 portas"
                    />
                  </div>
                </div>

                {/* Descrição */}
                <div>
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Descrição detalhada do veículo..."
                    rows={3}
                  />
                </div>

                {/* Opcionais */}
                <div>
                  <Label htmlFor="features">Opcionais e Equipamentos</Label>
                  <Textarea
                    id="features"
                    value={formData.features}
                    onChange={(e) => handleInputChange('features', e.target.value)}
                    placeholder="Digite um opcional por linha:&#10;Ar condicionado digital&#10;Central multimídia&#10;Câmera de ré"
                    rows={5}
                  />
                  <p className="text-sm text-gray-500 mt-1">Digite um opcional por linha</p>
                </div>

                {/* Especificações */}
                <div>
                  <Label htmlFor="specifications">Especificações Técnicas (JSON)</Label>
                  <Textarea
                    id="specifications"
                    value={formData.specifications}
                    onChange={(e) => handleInputChange('specifications', e.target.value)}
                    placeholder='{"Motor": "2.0 16V", "Potência": "150 cv", "Torque": "19,0 kgfm"}'
                    rows={4}
                  />
                  <p className="text-sm text-gray-500 mt-1">Formato JSON com as especificações técnicas</p>
                </div>

                {/* Upload de Imagens */}
                <div>
                  <Label htmlFor="images">Fotos do Veículo</Label>
                  <div className="mt-2">
                    <input
                      id="images"
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageSelect}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                    />
                  </div>
                  
                  {imageUrls.length > 0 && (
                    <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                      {imageUrls.map((url, index) => (
                        <div key={index} className="relative">
                          <img
                            src={url}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const newImages = selectedImages.filter((_, i) => i !== index)
                              const newUrls = imageUrls.filter((_, i) => i !== index)
                              setSelectedImages(newImages)
                              setImageUrls(newUrls)
                            }}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Botões */}
                <div className="flex justify-end space-x-4 pt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancelar
                  </Button>
                  <Button 
                    type="submit" 
                    className="bg-green-600 hover:bg-green-700"
                    disabled={loading || uploadingImages}
                  >
                    {loading || uploadingImages ? (
                      <>
                        <Upload className="w-4 h-4 mr-2 animate-spin" />
                        {uploadingImages ? 'Enviando fotos...' : 'Salvando...'}
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        {editingVehicle ? 'Atualizar' : 'Salvar'}
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Vehicles Table */}
        <Card>
          <CardHeader>
            <CardTitle>Lista de Veículos</CardTitle>
            <CardDescription>
              {vehicles.length} veículo(s) cadastrado(s)
            </CardDescription>
          </CardHeader>
          <CardContent>
            {vehicles.length === 0 ? (
              <div className="text-center py-12">
                <Car className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum veículo cadastrado</h3>
                <p className="text-gray-500 mb-4">Comece adicionando seu primeiro veículo ao estoque</p>
                <Button 
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => {
                    resetForm()
                    setIsDialogOpen(true)
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Primeiro Veículo
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Veículo</TableHead>
                    <TableHead>Ano</TableHead>
                    <TableHead>Preço</TableHead>
                    <TableHead>Quilometragem</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vehicles.map((vehicle) => (
                    <TableRow key={vehicle.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          {vehicle.images && vehicle.images[0] && (
                            <img
                              src={vehicle.images[0]}
                              alt={vehicle.name}
                              className="w-12 h-12 object-cover rounded-lg"
                            />
                          )}
                          <div>
                            <div className="font-medium">{vehicle.name}</div>
                            <div className="text-sm text-gray-500">{vehicle.color}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{vehicle.year}</TableCell>
                      <TableCell className="font-medium">{vehicle.price}</TableCell>
                      <TableCell>{vehicle.mileage}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">Disponível</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(vehicle)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(vehicle.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

export default Admin

