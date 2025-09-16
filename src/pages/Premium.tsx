import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Crown, 
  ArrowLeft, 
  Check, 
  Star, 
  Zap,
  Heart,
  RotateCcw,
  Eye,
  Sparkles,
  Palette,
  Settings
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Premium = () => {
  const [selectedPlan, setSelectedPlan] = useState('monthly');

  const features = [
    { icon: Eye, title: 'Ver quem gostou de você', description: 'Veja todos que deram like no seu perfil' },
    { icon: Heart, title: 'Curtidas ilimitadas', description: 'Sem limite de likes por dia' },
    { icon: Zap, title: '1 Boost por mês', description: 'Seja visto por mais pessoas' },
    { icon: RotateCcw, title: 'Voltar atrás', description: 'Desfaça swipes acidentais' },
    { icon: Sparkles, title: 'Perfil premium', description: 'Avatares animados e emblemas exclusivos' },
    { icon: Palette, title: 'Temas personalizados', description: 'Customize a aparência do app' },
    { icon: Crown, title: 'Insígnia exclusiva', description: 'Mostre que você é premium' },
    { icon: Settings, title: 'Personalização avançada', description: 'Mais opções de filtros e configurações' }
  ];

  const plans = [
    {
      id: 'monthly',
      name: 'Mensal',
      price: 'R$ 29,90',
      period: '/mês',
      description: 'Perfeito para experimentar',
      savings: null,
      recommended: false
    },
    {
      id: 'quarterly',
      name: 'Trimestral',
      price: 'R$ 24,90',
      period: '/mês',
      description: 'Economize R$ 15',
      savings: '17% OFF',
      recommended: true
    },
    {
      id: 'yearly',
      name: 'Anual',
      price: 'R$ 19,90',
      period: '/mês',
      description: 'Melhor valor - Economize R$ 120',
      savings: '33% OFF',
      recommended: false
    }
  ];

  const handleSubscribe = () => {
    // TODO: Implement Stripe payment
    console.log('Subscribe to plan:', selectedPlan);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="gradient-gaming p-4">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <Link to="/swipe">
            <Button variant="ghost" size="icon" className="text-white">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold text-white">TinderGamer Premium</h1>
          <div className="w-10"></div>
        </div>
      </div>

      <div className="p-4 max-w-md mx-auto space-y-6">
        {/* Premium Badge */}
        <div className="text-center py-6">
          <div className="inline-flex items-center justify-center w-20 h-20 gradient-gaming rounded-full mb-4 glow-gaming">
            <Crown className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Upgrade para Premium</h2>
          <p className="text-muted-foreground">
            Desbloqueie recursos exclusivos e encontre matches mais rapidamente
          </p>
        </div>

        {/* Features */}
        <div className="space-y-3">
          {features.map((feature, index) => (
            <Card key={index} className="border-accent/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-gaming-blue to-gaming-purple rounded-lg">
                    <feature.icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm">{feature.title}</h3>
                    <p className="text-xs text-muted-foreground">{feature.description}</p>
                  </div>
                  <Check className="w-5 h-5 text-green-500" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Plans */}
        <div className="space-y-3">
          <h3 className="font-semibold text-lg text-center">Escolha seu plano</h3>
          
          {plans.map((plan) => (
            <Card 
              key={plan.id}
              className={`cursor-pointer transition-all ${
                selectedPlan === plan.id 
                  ? 'border-gaming-purple bg-accent/10 glow-gaming' 
                  : 'hover:border-accent'
              } ${plan.recommended ? 'border-gaming-purple' : ''}`}
              onClick={() => setSelectedPlan(plan.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold">{plan.name}</h4>
                      {plan.recommended && (
                        <Badge className="bg-gaming-purple text-white text-xs">
                          Mais Popular
                        </Badge>
                      )}
                      {plan.savings && (
                        <Badge variant="outline" className="text-green-600 border-green-600 text-xs">
                          {plan.savings}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{plan.description}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold">{plan.price}</div>
                    <div className="text-sm text-muted-foreground">{plan.period}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Subscribe Button */}
        <div className="space-y-4">
          <Button 
            variant="premium" 
            className="w-full" 
            size="lg"
            onClick={handleSubscribe}
          >
            <Crown className="w-5 h-5 mr-2" />
            Assinar TinderGamer Premium
          </Button>
          
          <p className="text-xs text-muted-foreground text-center">
            Cancele a qualquer momento. Renovação automática. 
            Ao continuar, você aceita nossos termos de serviço.
          </p>
        </div>

        {/* Free Alternative */}
        <Card className="border-dashed">
          <CardContent className="p-4 text-center">
            <h4 className="font-semibold mb-2">Continue grátis</h4>
            <p className="text-sm text-muted-foreground mb-3">
              Use o TinderGamer com recursos limitados
            </p>
            <Link to="/swipe">
              <Button variant="outline" className="w-full">
                Continuar Grátis
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Benefits Summary */}
        <div className="bg-gradient-to-r from-gaming-blue/10 to-gaming-purple/10 rounded-xl p-4">
          <div className="text-center">
            <Star className="w-8 h-8 text-gaming-purple mx-auto mb-2" />
            <h4 className="font-semibold mb-2">Por que ser Premium?</h4>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>• 3x mais matches em média</p>
              <p>• Acesso prioritário a novos recursos</p>
              <p>• Suporte premium 24/7</p>
              <p>• Sem anúncios</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Premium;