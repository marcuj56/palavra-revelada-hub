import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BarChart3, Vote, Users, TrendingUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface Poll {
  id: string;
  question: string;
  options: string[];
  is_active: boolean;
  created_at: string;
}

interface Vote {
  poll_id: string;
  selected_option: string;
}

const LivePolls = () => {
  const [activePoll, setActivePoll] = useState<Poll | null>(null);
  const [votes, setVotes] = useState<Vote[]>([]);
  const [hasVoted, setHasVoted] = useState(false);
  const [userVote, setUserVote] = useState<string>("");
  const { toast } = useToast();

  useEffect(() => {
    fetchActivePoll();
    
    const channel = supabase
      .channel('polls-updates')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'poll_votes' },
        (payload) => {
          setVotes(prev => [...prev, payload.new as Vote]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchActivePoll = async () => {
    const { data: pollData } = await supabase
      .from('polls')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(1);

    if (pollData && pollData.length > 0) {
      const poll = pollData[0];
      setActivePoll(poll);
      
      // Fetch votes for this poll
      const { data: votesData } = await supabase
        .from('poll_votes')
        .select('*')
        .eq('poll_id', poll.id);
      
      if (votesData) {
        setVotes(votesData);
      }

      // Check if user has voted (using IP as identifier)
      const userIP = await getUserIP();
      const userVoteData = votesData?.find(vote => vote.user_ip === userIP);
      if (userVoteData) {
        setHasVoted(true);
        setUserVote(userVoteData.selected_option);
      }
    }
  };

  const getUserIP = async () => {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch {
      return 'unknown-' + Math.random().toString(36).substr(2, 9);
    }
  };

  const handleVote = async (option: string) => {
    if (!activePoll || hasVoted) return;

    const userIP = await getUserIP();
    
    const { error } = await supabase
      .from('poll_votes')
      .insert({
        poll_id: activePoll.id,
        user_ip: userIP,
        selected_option: option
      });

    if (error) {
      if (error.code === '23505') { // Unique constraint violation
        toast({
          title: "Já votou",
          description: "Já participou nesta sondagem",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Erro",
          description: "Erro ao registrar voto",
          variant: "destructive"
        });
      }
    } else {
      setHasVoted(true);
      setUserVote(option);
      toast({
        title: "Voto registrado!",
        description: "Obrigado pela sua participação",
      });
    }
  };

  const getVoteCount = (option: string) => {
    return votes.filter(vote => vote.selected_option === option).length;
  };

  const getTotalVotes = () => {
    return votes.length;
  };

  const getVotePercentage = (option: string) => {
    const total = getTotalVotes();
    if (total === 0) return 0;
    return Math.round((getVoteCount(option) / total) * 100);
  };

  if (!activePoll) {
    return (
      <Card className="bg-gradient-to-br from-white via-blue-50 to-purple-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary">
            <BarChart3 className="w-5 h-5" />
            Sondagem do Debate
          </CardTitle>
          <CardDescription>
            Nenhuma sondagem ativa no momento
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-white via-blue-50 to-purple-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-primary">
          <BarChart3 className="w-5 h-5" />
          Sondagem do Debate
        </CardTitle>
        <CardDescription>
          Participe da sondagem sobre "Crescendo na Fé"
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 bg-white rounded-lg border">
          <h3 className="font-semibold text-lg mb-4 text-primary">
            {activePoll.question}
          </h3>
          
          <div className="space-y-3">
            {activePoll.options.map((option, index) => {
              const voteCount = getVoteCount(option);
              const percentage = getVotePercentage(option);
              const isUserVote = userVote === option;
              
              return (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Button
                      variant={hasVoted ? "outline" : "default"}
                      className={`flex-1 text-left justify-start ${
                        isUserVote ? 'border-primary bg-primary/10' : ''
                      }`}
                      onClick={() => handleVote(option)}
                      disabled={hasVoted}
                    >
                      <Vote className="w-4 h-4 mr-2" />
                      {option}
                      {isUserVote && (
                        <Badge variant="secondary" className="ml-auto">
                          Seu voto
                        </Badge>
                      )}
                    </Button>
                  </div>
                  
                  {hasVoted && (
                    <div className="space-y-1">
                      <Progress value={percentage} className="h-2" />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{voteCount} votos</span>
                        <span>{percentage}%</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          
          <div className="mt-4 pt-4 border-t flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{getTotalVotes()} participantes</span>
            </div>
            <div className="flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              <span>Ao vivo</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LivePolls;