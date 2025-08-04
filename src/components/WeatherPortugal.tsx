import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Cloud, Sun, CloudRain, Thermometer, Wind, Eye, Droplets } from "lucide-react";

interface WeatherData {
  location: string;
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  visibility: number;
  icon: string;
}

const WeatherPortugal = () => {
  const [weather, setWeather] = useState<WeatherData[]>([]);
  const [loading, setLoading] = useState(true);

  const cities = [
    { name: "Lisboa", lat: 38.7223, lon: -9.1393 },
    { name: "Porto", lat: 41.1579, lon: -8.6291 },
    { name: "Coimbra", lat: 40.2033, lon: -8.4103 },
    { name: "Braga", lat: 41.5454, lon: -8.4265 },
    { name: "Faro", lat: 37.0194, lon: -7.9322 }
  ];

  useEffect(() => {
    const fetchWeather = async () => {
      const weatherData: WeatherData[] = [];
      
      for (const city of cities) {
        try {
          // Simulação de dados meteorológicos (em produção, use uma API real)
          const data: WeatherData = {
            location: city.name,
            temperature: Math.round(Math.random() * 20 + 10), // 10-30°C
            condition: ["Ensolarado", "Parcialmente nublado", "Nublado", "Chuva leve"][Math.floor(Math.random() * 4)],
            humidity: Math.round(Math.random() * 40 + 40), // 40-80%
            windSpeed: Math.round(Math.random() * 20 + 5), // 5-25 km/h
            visibility: Math.round(Math.random() * 5 + 10), // 10-15 km
            icon: ["sun", "cloud", "rain"][Math.floor(Math.random() * 3)]
          };
          weatherData.push(data);
        } catch (error) {
          console.error(`Erro ao buscar clima para ${city.name}:`, error);
        }
      }
      
      setWeather(weatherData);
      setLoading(false);
    };

    fetchWeather();
    
    // Atualizar a cada 10 minutos
    const interval = setInterval(fetchWeather, 600000);
    return () => clearInterval(interval);
  }, []);

  const getWeatherIcon = (condition: string) => {
    if (condition.includes("Ensolarado")) return <Sun className="w-8 h-8 text-yellow-500" />;
    if (condition.includes("Chuva")) return <CloudRain className="w-8 h-8 text-blue-500" />;
    return <Cloud className="w-8 h-8 text-gray-500" />;
  };

  const getConditionColor = (condition: string) => {
    if (condition.includes("Ensolarado")) return "bg-yellow-100 text-yellow-800";
    if (condition.includes("Chuva")) return "bg-blue-100 text-blue-800";
    return "bg-gray-100 text-gray-800";
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Thermometer className="w-5 h-5" />
            Clima em Portugal
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Carregando dados meteorológicos...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Thermometer className="w-5 h-5" />
          Clima em Portugal
        </CardTitle>
        <CardDescription>
          Condições meteorológicas atuais nas principais cidades
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {weather.map((city, index) => (
            <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors">
              <div className="flex items-center gap-4">
                {getWeatherIcon(city.condition)}
                <div>
                  <h4 className="font-semibold">{city.location}</h4>
                  <Badge variant="outline" className={getConditionColor(city.condition)}>
                    {city.condition}
                  </Badge>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-2xl font-bold">{city.temperature}°C</div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                  <div className="flex items-center gap-1">
                    <Droplets className="w-3 h-3" />
                    <span>{city.humidity}%</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Wind className="w-3 h-3" />
                    <span>{city.windSpeed} km/h</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    <span>{city.visibility} km</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 p-3 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground text-center">
            Dados atualizados automaticamente • Última atualização: {new Date().toLocaleTimeString('pt-PT')}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeatherPortugal;