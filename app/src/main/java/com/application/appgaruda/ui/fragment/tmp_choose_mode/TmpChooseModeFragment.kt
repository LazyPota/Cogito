package com.application.appgaruda.ui.fragment.tmp_choose_mode

import android.app.AlertDialog
import android.content.Intent
import androidx.fragment.app.viewModels
import android.os.Bundle
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import androidx.navigation.fragment.findNavController
import com.application.appgaruda.R
import com.application.appgaruda.helper.SessionManager
import com.application.appgaruda.ui.activity.LoginActivity

class TmpChooseModeFragment : Fragment() {

    private val viewModel: TmpChooseModeViewModel by viewModels()
    private lateinit var btnLogOut: Button

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        return inflater.inflate(R.layout.fragment_tmp_choose_mode, container, false)
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        inisialisasi(view)
        handlelistener()
    }


    private fun handlelistener() {
        val session = SessionManager(requireContext())
        btnLogOut.setOnClickListener {
            AlertDialog.Builder(requireContext())
                .setTitle("Konfirmasi Logout")
                .setMessage("Apakah kamu yakin ingin logout?")
                .setPositiveButton("Ya") { dialog, _ ->
                    session.clearSession()
                    val intent = Intent(requireContext(), LoginActivity::class.java)
                    startActivity(intent)
                    requireActivity().finish()
                    dialog.dismiss()
                }
                .setNegativeButton("Batal") { dialog, _ ->
                    dialog.dismiss()
                }
                .show()
        }

    }

    private fun inisialisasi(view: View) {
        btnLogOut = view.findViewById(R.id.btn_log_out)
    }
}