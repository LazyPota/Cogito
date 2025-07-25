package com.application.appgaruda.ui.fragment.profile

import android.content.Intent
import androidx.fragment.app.viewModels
import android.os.Bundle
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.TextView
import com.application.appgaruda.R
import com.application.appgaruda.data.api.RetrofitClient
import com.application.appgaruda.data.repository.IssueRepository
import com.application.appgaruda.factory.HomeViewModelFactory
import com.application.appgaruda.helper.SessionManager
import com.application.appgaruda.ui.activity.LoginActivity
import com.application.appgaruda.ui.fragment.home.HomeViewModel

class ProfileFragment : Fragment() {

    private val viewModel: ProfileViewModel by viewModels()
    private val vmh: HomeViewModel by viewModels {
        val sessionManager = SessionManager(requireContext())
        val apiService = RetrofitClient.getApiService(sessionManager)
        val repository = IssueRepository(apiService)
        HomeViewModelFactory(repository)
    }
    private lateinit var btnLogOut: Button
    private lateinit var tvUsernameHolder: TextView
    private lateinit var tv_isi_lvl_exp: TextView

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        return inflater.inflate(R.layout.fragment_profile, container, false)
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        inisialisasi(view)

        handlelistener()
    }

    private fun handlelistener() {
        btnLogOut.setOnClickListener {
            val sessionManager = SessionManager(requireContext())
            sessionManager.clearSession()
            val intent = Intent(requireContext(), LoginActivity::class.java)
            intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
            startActivity(intent)
        }
    }

    private fun inisialisasi(view: View) {
        btnLogOut = view.findViewById(R.id.btn_log_out)
        tvUsernameHolder = view.findViewById(R.id.tv_username_holder)
        tv_isi_lvl_exp = view.findViewById(R.id.tv_isi_lvl_exp)
        vmh.userXp.observe(viewLifecycleOwner) { xp ->
            tv_isi_lvl_exp.text = "level 1 - ${xp}XP"
        }
        vmh.fetchUserXp(SessionManager(requireContext()).getUsername().orEmpty())
        //* set
        val session = SessionManager(requireContext())
        tvUsernameHolder.text = session.getUsername().toString()

    }
}