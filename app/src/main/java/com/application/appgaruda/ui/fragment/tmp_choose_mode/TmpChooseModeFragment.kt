package com.application.appgaruda.ui.fragment.tmp_choose_mode


import android.content.Context
import android.os.Build
import android.os.Bundle
import android.util.EventLogTags.Description
import android.util.Log
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.TextView
import android.widget.Toast
import androidx.core.content.ContextCompat
import androidx.lifecycle.ViewModelProvider
import androidx.navigation.fragment.findNavController
import com.application.appgaruda.R
import com.application.appgaruda.data.api.RetrofitClient
import com.application.appgaruda.data.repository.IssueRepository
import com.application.appgaruda.factory.TmpChooseModeViewModelFactory
import com.application.appgaruda.helper.SessionManager

class TmpChooseModeFragment : Fragment() {

    private lateinit var viewModel: TmpChooseModeViewModel
    private lateinit var tvDeskripPro: TextView

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        return inflater.inflate(R.layout.fragment_tmp_choose_mode, container, false)
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        // Setup ViewModel
        val sessionManager = SessionManager(requireContext())
        val repository = IssueRepository(RetrofitClient.getApiService(sessionManager))
        val factory = TmpChooseModeViewModelFactory(repository)
        viewModel = ViewModelProvider(this, factory).get(TmpChooseModeViewModel::class.java)

        inisialisasi(view)
        handleListener()


    }

    private fun inisialisasi(view: View) {
        tvDeskripPro = view.findViewById(R.id.tv_deskrip_pro)


        val icBack = view.findViewById<View>(R.id.ic_back)
        icBack.setOnClickListener {
            findNavController().popBackStack()
        }

        requireActivity().window.statusBarColor = ContextCompat.getColor(requireContext(), R.color.white)
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            requireActivity().window.decorView.systemUiVisibility = View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR
        }
    }

    private fun handleListener() {
        val btnPro = requireView().findViewById<Button>(R.id.btn_pro)
        val btnContra = requireView().findViewById<Button>(R.id.btn_contra)

        val topicId = arguments?.getString("topicId")
        val tittle = arguments?.getString("tittle")
        Log.d("onviewq", "onViewCreated: $topicId ")
        val description = arguments?.getString("description")
        tvDeskripPro.text = "Description: $description"

        observeData()

        btnPro.setOnClickListener {
            navigateToDebate(topicId, "PRO",tittle)
        }

        btnContra.setOnClickListener {
            navigateToDebate(topicId, "CONTRA", tittle)
        }
    }

    private fun observeData() {}

    private fun navigateToDebate(topicId: String?, side: String, tittle: String?) {
        val sharedPref = requireContext().getSharedPreferences("debate_pref", Context.MODE_PRIVATE)
        with(sharedPref.edit()) {
            putString("topicId", topicId)
            putString("side", side)
            putString("title", tittle)
            apply()
        }
        findNavController().navigate(R.id.action_tmpChooseModeFragment_to_createActivity)
    }
}
