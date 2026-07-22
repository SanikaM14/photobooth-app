// src/pages/photo-gallery/index.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PrimaryNavigation from '../../components/ui/PrimaryNavigation';
import GalleryHeader from './components/GalleryHeader';
import SessionGroup from './components/SessionGroup';
import PhotoCard from './components/PhotoCard';
import EmptyGallery from './components/EmptyGallery';
import BulkActionBar from './components/BulkActionBar';
import DeleteConfirmationModal from './components/DeleteConfirmationModal';
import { photoAPI, sessionAPI } from '../../services/api';
import STRIP_TEMPLATES from '../../utils/stripTemplates';

const PhotoGallery = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('date-desc');
  const [filterBy, setFilterBy] = useState('all');
  const [selectedPhotos, setSelectedPhotos] = useState([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [photosToDelete, setPhotosToDelete] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [allPhotos, setAllPhotos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const authStatus = localStorage.getItem('isAuthenticated');
    if (!authStatus) {
      navigate('/login');
      return;
    }

    fetchData();
  }, [navigate]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      // Fetch from backend
      const photosResponse = await photoAPI.getDownloadedPhotos();
      const mappedPhotos = (photosResponse || []).map((p) => ({
        id: p.id,
        image: p.thumbnailUrl || p.url,
        imageAlt: 'Captured photo',
        filterType: p.filterName,
        filterName: p.filterName,
        captureDate: p.createdAt,
        captureTime: p.createdAt ? new Date(p.createdAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }) : '',
        title: `Photo ${p.id}`,
        description: '',
        filterApplied: p.filterName,
        imageUrl: p.url,
        sessionId: p.sessionId,
        photoOrder: p.photoOrder,
        stripTemplateId: p.stripTemplateId,
        isDownloaded: true,
        downloadCount: 1
      }));

      setAllPhotos(mappedPhotos);

      const sessionsResponse = await sessionAPI.getUserSessions();
      const groupedSessions = (sessionsResponse || []).map((s) => ({
        id: s.id,
        name: s.title,
        date: s.createdAt,
        photos: (s.photos || []).map((p) => ({
          id: p.id,
          image: p.thumbnailUrl || p.url,
          imageAlt: 'Captured photo',
          filterType: p.filterName,
          filterName: p.filterName,
          captureDate: p.createdAt,
          captureTime: p.createdAt ? new Date(p.createdAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }) : '',
          title: `Photo ${p.id}`,
          description: '',
          filterApplied: p.filterName,
          imageUrl: p.url,
          sessionId: s.id,
          photoOrder: p.photoOrder,
          stripTemplateId: p.stripTemplateId,
          isDownloaded: true,
          downloadCount: 1
        }))
      })).filter(session => session.photos.length > 0);

      setSessions(groupedSessions);
      
    } catch (error) {
      console.error('Failed to fetch data:', error);
      // Fallback to empty state on error
      const mockPhotos = [
        
      ];
      
      setAllPhotos(mockPhotos);
      setSessions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const getFilteredAndSortedPhotos = () => {
    let photos = [...allPhotos];

    if (searchQuery) {
      photos = photos.filter((photo) =>
        photo.title?.toLowerCase()?.includes(searchQuery.toLowerCase()) ||
        photo.description?.toLowerCase()?.includes(searchQuery.toLowerCase()) ||
        photo.filterApplied?.toLowerCase()?.includes(searchQuery.toLowerCase())
      );
    }

    if (filterBy !== 'all') {
      photos = photos.filter((photo) => photo.filterApplied === filterBy);
    }

    switch (sortBy) {
      case 'date-desc':
        photos.sort((a, b) => new Date(b.captureDate) - new Date(a.captureDate));
        break;
      case 'date-asc':
        photos.sort((a, b) => new Date(a.captureDate) - new Date(b.captureDate));
        break;
      case 'filter':
        photos.sort((a, b) => a.filterApplied?.localeCompare(b.filterApplied));
        break;
      case 'session':
        return photos;
      default:
        break;
    }

    return photos;
  };

  const getFilteredSessions = () => {
    return sessions.map((session) => ({
      ...session,
      photos: session.photos.filter((photo) => {
        const matchesSearch = !searchQuery ||
          photo.title?.toLowerCase()?.includes(searchQuery.toLowerCase()) ||
          photo.description?.toLowerCase()?.includes(searchQuery.toLowerCase()) ||
          photo.filterApplied?.toLowerCase()?.includes(searchQuery.toLowerCase());

        const matchesFilter = filterBy === 'all' || photo.filterApplied === filterBy;

        return matchesSearch && matchesFilter;
      })
    })).filter((session) => session.photos.length > 0);
  };

  const handlePhotoSelect = (photoId) => {
    setSelectedPhotos((prev) =>
      prev.includes(photoId) ?
      prev.filter((id) => id !== photoId) :
      [...prev, photoId]
    );
  };

  const handleClearSelection = () => {
    setSelectedPhotos([]);
  };

  const handleDownload = async (photoId) => {
    try {
      const photo = allPhotos.find(p => p.id === photoId);
      if (photo?.imageUrl) {
        const response = await fetch(photo.imageUrl);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `photo_${photoId}.jpg`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        // Mark as downloaded in backend
        await photoAPI.markAsDownloaded(photoId);
      }
    } catch (error) {
      console.error('Download failed:', error);
      alert('Failed to download photo. Please try again.');
    }
  };

  const handleDownloadAll = async () => {
    for (const photoId of selectedPhotos) {
      await handleDownload(photoId);
    }
  };

  const handleShare = (photoId) => {
    const photo = allPhotos.find(p => p.id === photoId);
    if (photo?.imageUrl) {
      navigator.clipboard.writeText(photo.imageUrl);
      alert('Photo link copied to clipboard!');
    }
  };

  const handleShareAll = () => {
    const links = selectedPhotos.map(photoId => {
      const photo = allPhotos.find(p => p.id === photoId);
      return photo?.imageUrl;
    }).filter(Boolean).join('\n');
    
    navigator.clipboard.writeText(links);
    alert('All photo links copied to clipboard!');
  };

  const handleDeleteClick = (photoId) => {
    setPhotosToDelete([photoId]);
    setDeleteModalOpen(true);
  };

  const handleBulkDeleteClick = () => {
    setPhotosToDelete(selectedPhotos);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      for (const photoId of photosToDelete) {
        // Delete from backend
        await photoAPI.deletePhoto(photoId);
        
        // Remove from local state
        setAllPhotos(prev => prev.filter(p => p.id !== photoId));
        setSessions(prev => prev.map(session => ({
          ...session,
          photos: session.photos.filter(p => p.id !== photoId)
        })).filter(session => session.photos.length > 0));
      }
      
      setSelectedPhotos([]);
      
    } catch (error) {
      console.error('Failed to delete photos:', error);
      alert('Failed to delete photos. Please try again.');
    } finally {
      setDeleteModalOpen(false);
      setPhotosToDelete([]);
    }
  };

  const handleReEdit = (photoId) => {
    const photo = allPhotos.find(p => p.id === photoId);
    if (!photo) return;

    const session = sessions.find(s => s.id === photo.sessionId);
    if (session) {
      const originalPhotos = session.photos
        .filter(p => p.photoOrder > 0)
        .map(p => ({
          id: p.id,
          url: p.imageUrl,
          order: p.photoOrder,
          filterName: p.filterName
        }))
        .sort((a, b) => a.order - b.order);

      if (originalPhotos.length > 0) {
        const templateId = photo.stripTemplateId;
        const template = STRIP_TEMPLATES.find(t => t.id === templateId) || 
                         STRIP_TEMPLATES.find(t => t.id === 'classic-film-4') || 
                         STRIP_TEMPLATES[0];

        navigate('/photo-editing', {
          state: {
            photos: originalPhotos,
            template,
            sessionId: photo.sessionId
          }
        });
        return;
      }
    }

    const templateId = photo.stripTemplateId;
    const template = STRIP_TEMPLATES.find(t => t.id === templateId) || 
                     STRIP_TEMPLATES.find(t => t.id === 'classic-film-4') || 
                     STRIP_TEMPLATES[0];
    navigate('/camera-capture', { state: { template } });
  };

  const totalPhotos = allPhotos.length;
  const displaySessions = sortBy === 'session' ? getFilteredSessions() : [];
  const displayPhotos = sortBy !== 'session' ? getFilteredAndSortedPhotos() : [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-rose-50 to-red-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-red-600">Loading your photos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-red-50">
      <PrimaryNavigation />
      
      <div className="pt-16">
        <GalleryHeader
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          sortBy={sortBy}
          onSortChange={setSortBy}
          filterBy={filterBy}
          onFilterChange={setFilterBy}
          totalPhotos={totalPhotos}
          selectedCount={selectedPhotos.length}
          onBulkDelete={handleBulkDeleteClick}
          onClearSelection={handleClearSelection}
        />

        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8 lg:py-12">
          {totalPhotos === 0 ? (
            <EmptyGallery />
          ) : sortBy === 'session' ? (
            <div className="space-y-4 md:space-y-6">
              {displaySessions.map((session) => (
                <SessionGroup
                  key={session.id}
                  session={session}
                  onPhotoSelect={handlePhotoSelect}
                  selectedPhotos={selectedPhotos}
                  onDownload={handleDownload}
                  onShare={handleShare}
                  onDelete={handleDeleteClick}
                  onReEdit={handleReEdit}
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {displayPhotos.map((photo) => (
                <PhotoCard
                  key={photo.id}
                  photo={photo}
                  isSelected={selectedPhotos.includes(photo.id)}
                  onSelect={handlePhotoSelect}
                  onDownload={handleDownload}
                  onShare={handleShare}
                  onDelete={handleDeleteClick}
                  onReEdit={handleReEdit}
                />
              ))}
            </div>
          )}
        </div>
      </div>
      
      <BulkActionBar
        selectedCount={selectedPhotos.length}
        onDownloadAll={handleDownloadAll}
        onShareAll={handleShareAll}
        onDeleteAll={handleBulkDeleteClick}
        onClearSelection={handleClearSelection}
      />
      
      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        photoCount={photosToDelete.length}
      />
    </div>
  );
};

export default PhotoGallery;