import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Star, 
  Heart, 
  Plus,
  Flame,
  Zap,
  Leaf,
  Apple,
  Milk,
  Wheat,
  Nut,
  Coffee,
  Cookie,
  Grid3X3,
  List,
  ChevronDown
} from 'lucide-react';
import { FoodService, Food } from '../services/foodService';
import { useFitness } from '../context/FitnessContext';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';

const FoodDatabasePage: React.FC = () => {
  const { goals } = useFitness();
  const [foods, setFoods] = useState<Food[]>([]);
  const [filteredFoods, setFilteredFoods] = useState<Food[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const categories = [
    { value: 'ALL', label: 'All Foods', icon: Grid3X3, color: 'from-gray-500 to-gray-600' },
    { value: 'PROTEIN', label: 'Protein', icon: Zap, color: 'from-red-500 to-red-600' },
    { value: 'CARBOHYDRATE', label: 'Carbs', icon: Wheat, color: 'from-yellow-500 to-yellow-600' },
    { value: 'VEGETABLE', label: 'Vegetables', icon: Leaf, color: 'from-green-500 to-green-600' },
    { value: 'FRUIT', label: 'Fruits', icon: Apple, color: 'from-pink-500 to-pink-600' },
    { value: 'DAIRY', label: 'Dairy', icon: Milk, color: 'from-blue-500 to-blue-600' },
    { value: 'NUTS_SEEDS', label: 'Nuts & Seeds', icon: Nut, color: 'from-amber-500 to-amber-600' },
    { value: 'BEVERAGE', label: 'Beverages', icon: Coffee, color: 'from-cyan-500 to-cyan-600' },
    { value: 'SNACK', label: 'Snacks', icon: Cookie, color: 'from-purple-500 to-purple-600' }
  ];

  useEffect(() => {
    loadFoods();
  }, []);

  useEffect(() => {
    filterFoods();
  }, [foods, searchQuery, selectedCategory]);

  const loadFoods = async () => {
    try {
      setIsLoading(true);
      const allFoods = await FoodService.getAllFoods();
      setFoods(allFoods);
    } catch (error) {
      console.error('Error loading foods:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterFoods = () => {
    let filtered = foods;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(food =>
        food.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        food.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== 'ALL') {
      filtered = filtered.filter(food => food.category === selectedCategory);
    }

    setFilteredFoods(filtered);
  };

  const getRecommendedFoods = async () => {
    if (!goals?.goal) return;
    
    try {
      const goalType = goals.goal.toUpperCase() as 'LOSS' | 'MAINTAIN' | 'GAIN';
      const recommended = await FoodService.getRecommendedFoods(goalType);
      setFoods(recommended);
      setSelectedCategory('ALL');
      setSearchQuery('');
    } catch (error) {
      console.error('Error loading recommended foods:', error);
    }
  };

  const getHighProteinFoods = async () => {
    try {
      const highProtein = await FoodService.getHighProteinFoods();
      setFoods(highProtein);
      setSelectedCategory('ALL');
      setSearchQuery('');
    } catch (error) {
      console.error('Error loading high protein foods:', error);
    }
  };

  const getLowCalorieFoods = async () => {
    try {
      const lowCalorie = await FoodService.getLowCalorieFoods();
      setFoods(lowCalorie);
      setSelectedCategory('ALL');
      setSearchQuery('');
    } catch (error) {
      console.error('Error loading low calorie foods:', error);
    }
  };

  const FoodCard = ({ food }: { food: Food }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="group"
    >
      <Card className="overflow-hidden">
        <div className="relative">
          <img
            src={food.imageUrl}
            alt={food.name}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.currentTarget.src = '/placeholder-food.jpg';
            }}
          />
          <div className="absolute top-2 right-2">
            <Button
              size="sm"
              variant="ghost"
              className="bg-white/90 hover:bg-white"
            >
              <Heart className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-1">
            {food.name}
          </h3>
          
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {food.description}
          </p>
          
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div className="text-center p-2 bg-orange-50 rounded-lg">
              <div className="text-lg font-bold text-orange-600">{food.calories}</div>
              <div className="text-xs text-gray-600">cal/100g</div>
            </div>
            <div className="text-center p-2 bg-blue-50 rounded-lg">
              <div className="text-lg font-bold text-blue-600">{food.protein}g</div>
              <div className="text-xs text-gray-600">protein</div>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-600">
              {food.category.replace('_', ' ')}
            </span>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-1" />
              Add
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );

  const FoodListItem = ({ food }: { food: Food }) => (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="group"
    >
      <Card className="p-4">
        <div className="flex items-center space-x-4">
          <img
            src={food.imageUrl}
            alt={food.name}
            className="w-16 h-16 object-cover rounded-lg"
            onError={(e) => {
              e.currentTarget.src = '/placeholder-food.jpg';
            }}
          />
          
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 mb-1">{food.name}</h3>
            <p className="text-sm text-gray-600 mb-2 line-clamp-1">
              {food.description}
            </p>
            <div className="flex items-center space-x-4 text-sm">
              <span className="flex items-center text-orange-600">
                <Flame className="w-4 h-4 mr-1" />
                {food.calories} cal
              </span>
              <span className="flex items-center text-blue-600">
                <Zap className="w-4 h-4 mr-1" />
                {food.protein}g protein
              </span>
              <span className="text-gray-500">
                {food.category.replace('_', ' ')}
              </span>
            </div>
          </div>
          
          <Button size="sm">
            <Plus className="w-4 h-4 mr-1" />
            Add
          </Button>
        </div>
      </Card>
    </motion.div>
  );

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Food Database</h1>
        <p className="text-gray-600">
          Discover healthy foods and track your nutrition with our comprehensive database.
        </p>
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8"
      >
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          {/* Search Bar */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search foods..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center space-x-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid3X3 className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Quick Filters */}
        <div className="flex flex-wrap gap-2 mb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={getRecommendedFoods}
          >
            <Star className="w-4 h-4 mr-1" />
            Recommended
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={getHighProteinFoods}
          >
            <Zap className="w-4 h-4 mr-1" />
            High Protein
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={getLowCalorieFoods}
          >
            <Flame className="w-4 h-4 mr-1" />
            Low Calorie
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="w-4 h-4 mr-1" />
            Filters
            <ChevronDown className={`w-4 h-4 ml-1 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </Button>
        </div>

        {/* Category Filters */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6"
          >
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => {
                const Icon = category.icon;
                const isActive = selectedCategory === category.value;
                
                return (
                  <Button
                    key={category.value}
                    variant={isActive ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedCategory(category.value)}
                    className={`${isActive ? `bg-gradient-to-r ${category.color} text-white` : ''}`}
                  >
                    <Icon className="w-4 h-4 mr-1" />
                    {category.label}
                  </Button>
                );
              })}
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Results Count */}
      <div className="mb-6">
        <p className="text-gray-600">
          Showing {filteredFoods.length} of {foods.length} foods
        </p>
      </div>

      {/* Food Grid/List */}
      {filteredFoods.length === 0 ? (
        <Card className="p-12 text-center">
          <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No foods found</h3>
          <p className="text-gray-600 mb-4">
            Try adjusting your search or filter criteria.
          </p>
          <Button onClick={() => {
            setSearchQuery('');
            setSelectedCategory('ALL');
          }}>
            Clear Filters
          </Button>
        </Card>
      ) : (
        <div className={
          viewMode === 'grid'
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
            : 'space-y-4'
        }>
          {filteredFoods.map((food) => (
            viewMode === 'grid' ? (
              <FoodCard key={food.id} food={food} />
            ) : (
              <FoodListItem key={food.id} food={food} />
            )
          ))}
        </div>
      )}
    </div>
  );
};

export default FoodDatabasePage;
