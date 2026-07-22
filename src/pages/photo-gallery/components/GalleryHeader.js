import React from 'react';

import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const GalleryHeader = ({ 
  searchQuery, 
  onSearchChange, 
  sortBy, 
  onSortChange,
  filterBy,
  onFilterChange,
  totalPhotos,
  selectedCount,
  onBulkDelete,
  onClearSelection
}) => {
  const sortOptions = [
    { value: 'date-desc', label: 'Newest First' },
    { value: 'date-asc', label: 'Oldest First' },
    { value: 'filter', label: 'By Filter Type' },
    { value: 'session', label: 'By Session' }
  ];

  const filterOptions = [
    { value: 'all', label: 'All Filters' },
    { value: 'red-dreamy', label: 'Red Dreamy' },
    { value: 'yellow-aesthetic', label: 'Yellow Aesthetic' },
    { value: 'retro', label: 'Retro' },
    { value: 'black-white', label: 'Black & White' },
    { value: 'clear', label: 'Clear' },
    { value: 'vintage', label: 'Vintage' },
    { value: 'sepia', label: 'Sepia' },
    { value: 'cool-tone', label: 'Cool Tone' },
    { value: 'warm-tone', label: 'Warm Tone' },
    { value: 'high-contrast', label: 'High Contrast' }
  ];

  return (
    <div className="bg-card border-b border-border">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-4 md:py-6">
        <div className="flex flex-col space-y-4 md:space-y-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-3 md:space-y-0">
            <div>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-heading font-semibold text-foreground">
                Photo Gallery
              </h1>
              <p className="text-sm md:text-base text-muted-foreground mt-1">
                {totalPhotos} {totalPhotos === 1 ? 'photo' : 'photos'} in your collection
              </p>
            </div>

            {selectedCount > 0 && (
              <div className="flex items-center space-x-3 bg-primary/10 px-4 py-2 rounded-lg">
                <span className="text-sm font-medium text-primary">
                  {selectedCount} selected
                </span>
                <Button
                  variant="destructive"
                  size="sm"
                  iconName="Trash2"
                  iconPosition="left"
                  onClick={onBulkDelete}
                >
                  Delete
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  iconName="X"
                  onClick={onClearSelection}
                >
                  Clear
                </Button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
            <div className="md:col-span-1">
              <Input
                type="search"
                placeholder="Search photos..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e?.target?.value)}
                className="w-full"
              />
            </div>

            <div className="md:col-span-1">
              <Select
                options={sortOptions}
                value={sortBy}
                onChange={onSortChange}
                placeholder="Sort by..."
              />
            </div>

            <div className="md:col-span-1">
              <Select
                options={filterOptions}
                value={filterBy}
                onChange={onFilterChange}
                placeholder="Filter by type..."
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GalleryHeader;