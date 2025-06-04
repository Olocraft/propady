
import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
    
    // If no user is logged in, redirect to auth page
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-8">My Profile</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Profile Card */}
            <Card className="glass-morphism border-white/10 text-white col-span-1">
              <CardHeader className="flex flex-col items-center">
                <Avatar className="h-24 w-24 mb-2">
                  <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`} />
                  <AvatarFallback className="bg-propady-purple text-white text-xl">
                    {user.email?.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <CardTitle>{user.email}</CardTitle>
                <CardDescription className="text-white/70">Member since {new Date().toLocaleDateString()}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col space-y-2 text-white/70">
                  <p className="flex justify-between">
                    <span>Email:</span>
                    <span className="text-white">{user.email}</span>
                  </p>
                  <p className="flex justify-between">
                    <span>User ID:</span>
                    <span className="text-white truncate max-w-[150px]">{user.id.substring(0, 8)}...</span>
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  variant="outline" 
                  className="w-full border-white/20 text-white hover:bg-white/10"
                  onClick={signOut}
                >
                  Sign Out
                </Button>
              </CardFooter>
            </Card>
            
            {/* Activity & Stats */}
            <Card className="glass-morphism border-white/10 text-white col-span-1 md:col-span-2">
              <CardHeader>
                <CardTitle>Activity & Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Properties</h3>
                  <Separator className="bg-white/20" />
                  <div className="flex justify-between py-2">
                    <span>Properties Viewed</span>
                    <span>0</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span>Properties Saved</span>
                    <span>0</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span>Properties Owned</span>
                    <span>0</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Investments</h3>
                  <Separator className="bg-white/20" />
                  <div className="flex justify-between py-2">
                    <span>Total Invested</span>
                    <span>$0.00</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span>Active Investments</span>
                    <span>0</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span>Returns Generated</span>
                    <span>$0.00</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button 
                  variant="default" 
                  className="bg-propady-purple hover:bg-propady-purple-light"
                  onClick={() => navigate('/marketplace')}
                >
                  Explore Properties
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
