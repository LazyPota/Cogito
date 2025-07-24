package com.application.appgaruda.ui.fragment.home

import androidx.fragment.app.viewModels
import android.os.Bundle
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import androidx.navigation.fragment.findNavController
import com.application.appgaruda.R
import com.google.android.material.bottomnavigation.BottomNavigationView

class HomeFragment : Fragment() {

    private val viewModel: HomeViewModel by viewModels()
    private lateinit var btnStarDebate: Button
    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        return inflater.inflate(R.layout.fragment_home, container, false)
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        inisialisasi(view)
        handlelistener()
    }

    private fun handlelistener() {
        btnStarDebate.setOnClickListener {
            val navView = requireActivity().findViewById<BottomNavigationView>(R.id.bottomNavigationView)
            navView.selectedItemId = R.id.issuesFragment
        }
    }


    private fun inisialisasi(view: View) {
        btnStarDebate = view.findViewById(R.id.btn_start_debate)
    }
}