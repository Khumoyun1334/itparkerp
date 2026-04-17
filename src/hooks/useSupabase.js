import { useState, useEffect } from 'react';
import { supabase } from '../config/supabase';

function useSupabase(tableName) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const { data: result, error: err } = await supabase
        .from(tableName)
        .select('*')
        .order('created_at', { ascending: false });
      
      if (err) {
        console.error('Fetch error:', err);
        setError(err.message);
        setData([]);
      } else {
        setData(result || []);
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      setError(err.message);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [tableName]);

  const addData = async (item) => {
    try {
      const { data: result, error: err } = await supabase
        .from(tableName)
        .insert([item])
        .select();
      
      if (err) {
        console.error('Add error:', err);
        setError(err.message);
        return null;
      }
      
      if (result && result.length > 0) {
        setData(prevData => [result[0], ...(prevData || [])]);
        return result[0];
      }
      return null;
    } catch (err) {
      console.error('Unexpected error:', err);
      return null;
    }
  };

  const updateData = async (id, updatedItem) => {
    try {
      const { data: result, error: err } = await supabase
        .from(tableName)
        .update(updatedItem)
        .eq('id', id)
        .select();
      
      if (err) {
        console.error('Update error:', err);
        setError(err.message);
        return false;
      }
      
      if (result && result.length > 0) {
        setData(prevData => prevData.map(item => item.id === id ? result[0] : item));
      }
      return true;
    } catch (err) {
      console.error('Unexpected error:', err);
      return false;
    }
  };

  const deleteData = async (id) => {
    try {
      const { error: err } = await supabase
        .from(tableName)
        .delete()
        .eq('id', id);
      
      if (err) {
        console.error('Delete error:', err);
        setError(err.message);
        return false;
      }
      
      setData(prevData => prevData.filter(item => item.id !== id));
      return true;
    } catch (err) {
      console.error('Unexpected error:', err);
      return false;
    }
  };

  const refresh = async () => {
    await fetchData();
  };

  return { data, loading, error, addData, updateData, deleteData, refresh };
}

export default useSupabase;