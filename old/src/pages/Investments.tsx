
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getUserInvestments } from '@/services/transactionService';
import { mapPropertyToDisplay } from '@/services/propertyService';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowUpRight, BarChart3, DollarSign, Wallet } from 'lucide-react';
import { motion } from 'framer-motion';

interface Investment {
  id: string;
  amount: number;
  tokens: number;
  created_at: string;
  properties: any;
}

const Investments = () => {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const fetchInvestments = async () => {
      if (!user) return;
      
      setLoading(true);
      try {
        const data = await getUserInvestments();
        setInvestments(data);
      } catch (error) {
        console.error('Error fetching investments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInvestments();
  }, [user]);

  const calculateTotalInvestment = () => {
    return investments.reduce((total, inv) => total + inv.amount, 0);
  };

  const calculateTotalTokens = () => {
    return investments.reduce((total, inv) => total + inv.tokens, 0);
  };

  // Calculate projected annual returns (mock calculation - 8% annual return)
  const calculateAnnualReturns = () => {
    const total = calculateTotalInvestment();
    return total * 0.08;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-28 pb-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Your Investments</h1>
              <p className="text-white/70">Track and manage your property investments</p>
            </div>
            
            <Button 
              className="mt-4 md:mt-0 bg-propady-purple hover:bg-propady-purple-light text-white"
              onClick={() => navigate('/marketplace')}
            >
              Browse More Properties
            </Button>
          </div>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card className="glass-morphism border-white/10">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg text-white">Total Invested</CardTitle>
                  <DollarSign className="text-propady-mint h-5 w-5" />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-white">
                  ${loading ? '...' : calculateTotalInvestment().toLocaleString()}
                </p>
                <p className="text-white/70 text-sm">Across {investments.length} properties</p>
              </CardContent>
            </Card>
            
            <Card className="glass-morphism border-white/10">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg text-white">Total Tokens</CardTitle>
                  <Wallet className="text-propady-mint h-5 w-5" />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-white">
                  {loading ? '...' : calculateTotalTokens().toLocaleString()}
                </p>
                <p className="text-white/70 text-sm">Property tokens</p>
              </CardContent>
            </Card>
            
            <Card className="glass-morphism border-white/10">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg text-white">Annual Returns</CardTitle>
                  <BarChart3 className="text-propady-mint h-5 w-5" />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-white">
                  ${loading ? '...' : calculateAnnualReturns().toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}
                </p>
                <p className="text-white/70 text-sm">Projected (8% APY)</p>
              </CardContent>
            </Card>
            
            <Card className="glass-morphism border-white/10">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg text-white">Properties</CardTitle>
                  <div className="h-5 w-5 rounded-full bg-propady-mint flex items-center justify-center text-xs font-bold">
                    {loading ? '...' : investments.length}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-white">
                  {loading ? '...' : investments.length}
                </p>
                <p className="text-white/70 text-sm">Active investments</p>
              </CardContent>
            </Card>
          </div>
          
          {/* Investments List */}
          <div className="glass-morphism border-white/10 rounded-xl overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-bold text-white mb-4">Your Property Investments</h2>
            </div>
            
            {loading ? (
              <div className="flex justify-center py-16">
                <div className="w-10 h-10 border-4 border-propady-purple border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : investments.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <h3 className="text-xl font-medium text-white/70 mb-4">No investments yet</h3>
                <p className="text-white/50 mb-8 max-w-md">
                  You haven't made any property investments yet. Start building your portfolio today!
                </p>
                <Button 
                  className="bg-propady-purple hover:bg-propady-purple-light text-white"
                  onClick={() => navigate('/marketplace')}
                >
                  Browse Properties
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-white">
                  <thead className="bg-black/30">
                    <tr>
                      <th className="px-6 py-4 text-left">Property</th>
                      <th className="px-6 py-4 text-left">Investment</th>
                      <th className="px-6 py-4 text-left">Tokens</th>
                      <th className="px-6 py-4 text-left">Date</th>
                      <th className="px-6 py-4 text-right"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {investments.map((investment, index) => {
                      const property = investment.properties;
                      const displayProperty = property ? mapPropertyToDisplay(property) : null;
                      
                      return (
                        <motion.tr 
                          key={investment.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                          className="border-b border-white/10 hover:bg-white/5 transition-colors"
                        >
                          <td className="px-6 py-4">
                            {displayProperty ? (
                              <div className="flex items-center">
                                <div className="w-10 h-10 rounded-md overflow-hidden mr-3">
                                  <img 
                                    src={displayProperty.image} 
                                    alt={displayProperty.title} 
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div>
                                  <p className="font-medium">{displayProperty.title}</p>
                                  <p className="text-sm text-white/70">{displayProperty.location}</p>
                                </div>
                              </div>
                            ) : (
                              <span className="text-white/50">Property unavailable</span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <p className="font-medium">${investment.amount.toLocaleString()}</p>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <div className="w-4 h-4 rounded-full bg-propady-mint/20 mr-2 flex items-center justify-center">
                                <div className="w-2 h-2 rounded-full bg-propady-mint"></div>
                              </div>
                              <span>{investment.tokens}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            {new Date(investment.created_at).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 text-right">
                            {displayProperty && (
                              <Button 
                                size="sm"
                                variant="ghost" 
                                className="text-propady-mint hover:bg-propady-mint/10"
                                onClick={() => navigate(`/property/${property.id}`)}
                              >
                                View <ArrowUpRight className="ml-1 h-4 w-4" />
                              </Button>
                            )}
                          </td>
                        </motion.tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Investments;
