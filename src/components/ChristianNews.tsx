import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Newspaper, Globe, Clock, ExternalLink, Cross, Heart } from "lucide-react";

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  category: string;
  source: string;
  publishedAt: string;
  url: string;
  imageUrl?: string;
}

const ChristianNews = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    { id: "all", name: "Todas", icon: Globe },
    { id: "church", name: "Igreja", icon: Cross },
    { id: "mission", name: "Missões", icon: Heart },
    { id: "world", name: "Mundial", icon: Newspaper }
  ];

  // Simulação de notícias cristãs (em produção, use APIs reais)
  const mockNews: NewsItem[] = [
    {
      id: "1",
      title: "Conferência Mundial de Evangelização reúne milhares de líderes cristãos",
      summary: "Evento histórico conecta igrejas de mais de 100 países para discutir estratégias de evangelização global.",
      category: "world",
      source: "Christian Today",
      publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      url: "https://christiantoday.com/news",
    },
    {
      id: "2", 
      title: "Igreja em Portugal inaugura novo centro de assistência social",
      summary: "Iniciativa beneficiará centenas de famílias carentes com alimentação, vestuário e apoio espiritual.",
      category: "church",
      source: "Gospel Prime",
      publishedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      url: "https://gospelprime.com.br/news",
    },
    {
      id: "3",
      title: "Missionários brasileiros estabelecem nova obra na África",
      summary: "Casal de missionários inicia trabalho evangelístico em região remota do continente africano.",
      category: "mission", 
      source: "Missões Mundiais",
      publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
      url: "https://missõesmundiais.com/news",
    },
    {
      id: "4",
      title: "Crescimento do cristianismo na Ásia supera expectativas",
      summary: "Relatório revela aumento significativo no número de convertidos em países asiáticos nos últimos anos.",
      category: "world",
      source: "World Christian Database",
      publishedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
      url: "https://worldchristiandatabase.org/news",
    },
    {
      id: "5",
      title: "Festival de música gospel atrai milhares de jovens em Lisboa",
      summary: "Evento evangelístico combina música contemporânea com mensagem de esperança para a juventude portuguesa.",
      category: "church",
      source: "Rádio Vivendo Na Fé",
      publishedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      url: "https://radiovivendonafe.pt/news",
    },
    {
      id: "6",
      title: "Projeto missionário leva água potável a comunidades carentes",
      summary: "Organização cristã perfura poços artesianos em aldeias remotas, transformando vidas através do acesso à água limpa.",
      category: "mission",
      source: "Água Viva Missões",
      publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      url: "https://aguavivamissões.org/news",
    }
  ];

  useEffect(() => {
    // Simular carregamento de notícias
    setTimeout(() => {
      setNews(mockNews);
      setLoading(false);
    }, 1000);

    // Atualizar notícias a cada 30 minutos
    const interval = setInterval(() => {
      // Em produção, fazer nova requisição à API
      setNews(mockNews.map(item => ({
        ...item,
        publishedAt: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString()
      })));
    }, 1800000);

    return () => clearInterval(interval);
  }, []);

  const filteredNews = selectedCategory === "all" 
    ? news 
    : news.filter(item => item.category === selectedCategory);

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`;
    return `${Math.floor(diffInMinutes / 1440)}d`;
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "church": return "bg-purple-100 text-purple-800";
      case "mission": return "bg-green-100 text-green-800";
      case "world": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Newspaper className="w-5 h-5" />
            Notícias Cristãs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Carregando notícias...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Newspaper className="w-5 h-5" />
          Notícias Cristãs
        </CardTitle>
        <CardDescription>
          Últimas notícias do mundo cristão e missionário em tempo real
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Filtros de categoria */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {categories.map((category) => {
            const IconComponent = category.icon;
            return (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className="flex items-center gap-2 whitespace-nowrap"
              >
                <IconComponent className="w-4 h-4" />
                {category.name}
              </Button>
            );
          })}
        </div>

        {/* Lista de notícias */}
        <div className="space-y-4">
          {filteredNews.map((item) => (
            <div key={item.id} className="border rounded-lg p-4 hover:bg-accent transition-colors">
              <div className="flex justify-between items-start mb-2">
                <Badge variant="outline" className={getCategoryColor(item.category)}>
                  {categories.find(c => c.id === item.category)?.name || "Outras"}
                </Badge>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  {formatTimeAgo(item.publishedAt)}
                </div>
              </div>
              
              <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                {item.title}
              </h3>
              
              <p className="text-muted-foreground mb-3 line-clamp-2">
                {item.summary}
              </p>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  {item.source}
                </span>
                <Button size="sm" variant="outline" asChild>
                  <a href={item.url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-3 h-3 mr-1" />
                    Ler mais
                  </a>
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-3 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground text-center">
            Notícias atualizadas automaticamente • Última atualização: {new Date().toLocaleTimeString('pt-PT')}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChristianNews;