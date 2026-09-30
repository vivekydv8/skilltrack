import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { fetchApi } from '../api/client';
import { MapPin, RefreshCw, Info } from 'lucide-react';

interface DistrictMetric {
  district: string;
  lat: number;
  lng: number;
  total_enrolled: number;
  certified: number;
  placed: number;
  placement_rate_pct: number;
  avg_wage: number;
  color: string;
}

export const DistrictMap: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  const [districts, setDistricts] = useState<DistrictMetric[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedDistrict, setSelectedDistrict] = useState<DistrictMetric | null>(null);

  const loadDistrictData = async () => {
    try {
      setIsLoading(true);
      const data = await fetchApi<DistrictMetric[]>('/api/analytics/district-map');
      setDistricts(data);
      if (data.length > 0 && !selectedDistrict) {
        setSelectedDistrict(data[0]);
      }
    } catch (err) {
      console.error('Failed to load district map analytics', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDistrictData();
  }, []);

  // Initialize Leaflet Map once
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Center of Maharashtra state
      const map = L.map(mapContainerRef.current, {
        center: [19.25, 76.0],
        zoom: 7,
        zoomControl: true,
        scrollWheelZoom: false,
      });

      // Free OpenStreetMap Tiles (Zero API key needed)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18,
      }).addTo(map);

      markersLayerRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;
    }

    return () => {
      // Don't destroy map on every render
    };
  }, []);

  // Update markers when district data updates
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current || districts.length === 0) return;

    markersLayerRef.current.clearLayers();

    districts.forEach((d) => {
      // Circle marker scaled by candidate volume and colored by placement rate
      const radius = Math.max(10, Math.min(22, d.total_enrolled * 1.2));
      const circle = L.circleMarker([d.lat, d.lng], {
        radius: radius,
        fillColor: d.color,
        color: '#ffffff',
        weight: 2,
        opacity: 1,
        fillOpacity: 0.85,
      });

      const popupContent = `
        <div style="font-family: Inter, sans-serif; font-size: 12px; padding: 4px; min-width: 170px;">
          <strong style="font-size: 13px; color: #0f203d;">${d.district} District</strong>
          <div style="margin-top: 6px; border-top: 1px solid #e2e8f0; padding-top: 4px;">
            <div>Enrolled: <b>${d.total_enrolled}</b> candidates</div>
            <div>Certified: <b>${d.certified}</b></div>
            <div>Placed: <b>${d.placed}</b></div>
            <div style="margin-top: 4px; font-weight: bold; color: ${d.color};">
              Placement Rate: ${d.placement_rate_pct}%
            </div>
            <div>Avg Wage: <b>₹${d.avg_wage.toLocaleString('en-IN')}</b></div>
          </div>
        </div>
      `;

      circle.bindPopup(popupContent);
      circle.on('click', () => {
        setSelectedDistrict(d);
      });

      markersLayerRef.current?.addLayer(circle);
    });
  }, [districts]);

  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
      {/* Map Header */}
      <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-gov-700" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Interactive Maharashtra District Employability Map
            </h2>
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Real-time geospatial visualization powered by Leaflet.js & OpenStreetMap • Computed from live SQL group-by records
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-[11px] font-medium text-slate-600 bg-white px-3 py-1 rounded border border-slate-200">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            &gt; 75% High
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            60-75% Medium
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
            &lt; 60% Aspirational
          </span>
          <button
            onClick={loadDistrictData}
            className="ml-2 p-1 hover:bg-slate-100 rounded text-slate-500"
            title="Refresh Map Data"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4">
        {/* Leaflet Map Canvas */}
        <div className="lg:col-span-3 h-[380px] relative">
          <div ref={mapContainerRef} className="w-full h-full z-0" />
        </div>

        {/* Selected District Sidebar */}
        <div className="p-4 bg-slate-50 border-t lg:border-t-0 lg:border-l border-slate-200 flex flex-col justify-between text-xs">
          {selectedDistrict ? (
            <div className="space-y-3">
              <div className="border-b border-slate-200 pb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gov-800 bg-gov-100 px-2 py-0.5 rounded">
                  Selected District
                </span>
                <h3 className="text-base font-black text-slate-900 mt-1">{selectedDistrict.district}</h3>
                <p className="text-[11px] text-slate-500">
                  Lat: {selectedDistrict.lat.toFixed(4)}, Lng: {selectedDistrict.lng.toFixed(4)}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between py-1 border-b border-slate-200/60">
                  <span className="text-slate-500">Total Enrolled</span>
                  <span className="font-bold text-slate-900">{selectedDistrict.total_enrolled}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/60">
                  <span className="text-slate-500">Certified</span>
                  <span className="font-bold text-slate-900">{selectedDistrict.certified}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/60">
                  <span className="text-slate-500">Total Placed</span>
                  <span className="font-bold text-slate-900">{selectedDistrict.placed}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/60">
                  <span className="text-slate-500">Placement Rate</span>
                  <span className="font-bold text-sm" style={{ color: selectedDistrict.color }}>
                    {selectedDistrict.placement_rate_pct}%
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Avg Starting Wage</span>
                  <span className="font-bold text-emerald-800">
                    ₹{selectedDistrict.avg_wage.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-400">Click a marker on the map to inspect district metrics.</p>
          )}

          <div className="mt-4 p-2 bg-white border border-slate-200 rounded text-[11px] text-slate-500 flex items-start gap-1.5">
            <Info className="w-3.5 h-3.5 text-gov-700 flex-shrink-0 mt-0.5" />
            <span>
              District metrics are computed directly by SQL aggregations over the trainee registry.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
